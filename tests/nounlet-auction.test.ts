import { assert, beforeEach, describe, test } from "matchstick-as/assembly";
import { clearStore } from "matchstick-as";
import {
    handleAuctionBid,
    handleAuctionCreated,
    // handleAuctionExtended,
    handleAuctionSettled,
} from "../src/nounlet-auction";
import {
    generateAuctionBidEvent,
    generateAuctionCreatedEvent,
    // generateAuctionExtendedEvent,
    generateAuctionSettledEvent,
} from "./mock-event-generator";
import { BigInt } from "@graphprotocol/graph-ts";
import { Account, Auction, Nounlet, Vault } from "../generated/schema";
import {
    findOrCreateToken,
    generateAccountId,
    generateAuctionId,
    generateDelegateId,
    generateNounletId,
} from "../src/utils/helpers";
import { ZERO_ADDRESS } from "../src/utils/constants";

describe("Nounlet Auction", () => {
    beforeEach(() => {
        clearStore();
    });

    describe("Auction Started Handler", () => {
        test("Should not persist a Nounlet, a Seed, and an auction if a vault does not exit", () => {
            // Given
            const vaultId = "0x481b8D3E615eF2b339F816A98Ac0fE363D881f3f".toLowerCase();
            const tokenAddress = "0xd8dE7B1CF394DDa77DFB5A45A5653b7A39B6ec5d".toLowerCase();
            const nounletId = BigInt.fromI32(1);
            const startTime = BigInt.fromI64(1657873934 as i64);
            // Set auction length of 4 hours
            const endTime = BigInt.fromI64(1658173934 as i64);

            // When
            handleAuctionCreated(generateAuctionCreatedEvent(vaultId, tokenAddress, nounletId, startTime, endTime));

            // Then
            assert.notInStore("Vault", vaultId);
            assert.notInStore("Nounlet", nounletId.toString());
            assert.notInStore("Seed", nounletId.toString());
            assert.notInStore("Auction", nounletId.toString());
        });

        test("Should not persist a Nounlet, a Seed, and an Auction if a vault does not contain a Noun", () => {
            // Given
            const tokenAddress = "0xd8dE7B1CF394DDa77DFB5A45A5653b7A39B6ec5d".toLowerCase();
            const token = findOrCreateToken(tokenAddress);
            const vault = new Vault("0x481b8D3E615eF2b339F816A98Ac0fE363D881f3f".toLowerCase());
            vault.token = token.id;
            // Vault noun not defined
            vault.save();
            const tokenId = BigInt.fromI32(1);
            const startTime = BigInt.fromI64(1657873934 as i64);
            // Set auction length of 4 hours
            const endTime = BigInt.fromI64(1672273934 as i64);

            // When
            handleAuctionCreated(generateAuctionCreatedEvent(vault.id, tokenAddress, tokenId, startTime, endTime));
            const nounletId = tokenId.toString();

            // Then
            assert.notInStore("Nounlet", nounletId.toString());
            assert.notInStore("Seed", nounletId.toString());
            assert.notInStore("Auction", nounletId.toString());
        });

        test("Should persist a Nounlet, a Seed, and an Auction if the vault exists", () => {
            // Given
            const tokenAddress = "0xd8dE7B1CF394DDa77DFB5A45A5653b7A39B6ec5d".toLowerCase();
            const token = findOrCreateToken(tokenAddress);
            const vault = new Vault("0x481b8D3E615eF2b339F816A98Ac0fE363D881f3f".toLowerCase());
            vault.noun = "1";
            vault.token = token.id;
            vault.save();
            const tokenId = BigInt.fromI32(1);
            const startTime = BigInt.fromI64(1657873934 as i64);
            // Set auction length of 4 hours
            const endTime = BigInt.fromI64(1672273934 as i64);

            // When
            handleAuctionCreated(generateAuctionCreatedEvent(vault.id, tokenAddress, tokenId, startTime, endTime));
            const nounletId = generateNounletId(tokenAddress, tokenId.toString());

            // Then
            // assert.fieldEquals("Seed", nounletId, "id", nounletId);
            // assert.fieldEquals("Nounlet", nounletId, "seed", nounletId);
            assert.fieldEquals("Nounlet", nounletId, "id", nounletId);
            assert.fieldEquals("Auction", nounletId, "id", nounletId);
            assert.fieldEquals("Auction", nounletId, "startTime", startTime.toString());
            assert.fieldEquals("Auction", nounletId, "endTime", endTime.toString());
            assert.fieldEquals("Auction", nounletId, "highestBidAmount", "0");
            assert.fieldEquals("Auction", nounletId, "settled", "false");
        });
    });

    describe("Auction Bid Handler", () => {
        test("Should prevent a bid if there is no auction", () => {
            // Given
            const tokenAddress = "0xd8dE7B1CF394DDa77DFB5A45A5653b7A39B6ec5d".toLowerCase();
            const token = findOrCreateToken(tokenAddress);
            const vault = new Vault("0x481b8D3E615eF2b339F816A98Ac0fE363D881f3f".toLowerCase());
            vault.noun = "1";
            vault.token = token.id;
            vault.save();
            const transactionId = "0xddb9addf21f868bb0804d7ea09ffdaa001390adf2e180210f7b32f2c46856f0f";
            const tokenId = 1;
            const bidderAddress = "0x5Bf1d2a415561A2F225F4523f3cbf552a6c692B7".toLowerCase();
            const bidAmount = 1234;
            const extendedTime = 1672279999;

            // When
            handleAuctionBid(
                generateAuctionBidEvent(
                    transactionId,
                    vault.id,
                    tokenAddress,
                    tokenId,
                    bidderAddress,
                    bidAmount,
                    extendedTime
                )
            );

            // Then
            assert.notInStore("Bid", transactionId);
        });

        test("Should process an auction bid", () => {
            // Given
            const tokenAddress = "0xd8dE7B1CF394DDa77DFB5A45A5653b7A39B6ec5d".toLowerCase();
            const token = findOrCreateToken(tokenAddress);
            const vault = new Vault("0x481b8D3E615eF2b339F816A98Ac0fE363D881f3f".toLowerCase());
            vault.noun = "1";
            vault.token = token.id;
            vault.save();
            const tokenId = 1;
            const auction = new Auction(generateAuctionId(tokenAddress, tokenId.toString()));
            auction.nounlet = tokenId.toString();
            auction.settled = false;
            auction.settledTransactionHash = ZERO_ADDRESS;
            auction.highestBidAmount = BigInt.fromI32(0);
            auction.highestBidder = null;
            auction.startTime = BigInt.fromI64(1657873934 as i64);
            auction.endTime = BigInt.fromI64(1672273934 as i64);
            auction.save();
            const transactionId = "0xddb9addf21f868bb0804d7ea09ffdaa001390adf2e180210f7b32f2c46856f0f";
            const bidderAddress = "0x5Bf1d2a415561A2F225F4523f3cbf552a6c692B7".toLowerCase();
            const bidAmount = 1234;
            const extendedTime = 1672279999;

            // When
            handleAuctionBid(
                generateAuctionBidEvent(
                    transactionId,
                    vault.id,
                    tokenAddress,
                    tokenId,
                    bidderAddress,
                    bidAmount,
                    extendedTime
                )
            );

            // Then
            const bidderId = generateAccountId(bidderAddress, tokenAddress);
            assert.fieldEquals("Auction", auction.id, "highestBidder", bidderId);
            assert.fieldEquals("Auction", auction.id, "highestBidAmount", bidAmount.toString());
            assert.fieldEquals("Auction", auction.id, "endTime", extendedTime.toString());
            assert.fieldEquals("Bid", transactionId, "auction", auction.id);
            assert.fieldEquals("Bid", transactionId, "bidder", bidderId);
            assert.fieldEquals("Bid", transactionId, "amount", bidAmount.toString());
        });
    });

    describe("Auction Settled Handler", () => {
        test("Should not settle an auction if an auction does not exist", () => {
            // Given
            const tokenAddress = "0xd8dE7B1CF394DDa77DFB5A45A5653b7A39B6ec5d".toLowerCase();
            const token = findOrCreateToken(tokenAddress);
            const vault = new Vault("0x481b8D3E615eF2b339F816A98Ac0fE363D881f3f".toLowerCase());
            vault.noun = "1";
            vault.token = token.id;
            vault.save();
            const tokenId = 1;
            const winnerAddress = "0x724CB381dA11ffeaad545de719cA6dD9accD27Fc".toLowerCase();
            const winnerAmount = 9999;

            // When
            handleAuctionSettled(
                generateAuctionSettledEvent(vault.id, tokenAddress, tokenId, winnerAddress, winnerAmount)
            );

            // Then
            assert.notInStore("Auction", tokenId.toString());
        });

        test("Should not settle an auction if a noun was moved from the vault", () => {
            // Given
            const tokenAddress = "0xd8dE7B1CF394DDa77DFB5A45A5653b7A39B6ec5d".toLowerCase();
            const token = findOrCreateToken(tokenAddress);
            const vault = new Vault("0x481b8D3E615eF2b339F816A98Ac0fE363D881f3f".toLowerCase());
            vault.noun = null;
            vault.token = token.id;
            vault.save();
            const tokenId = 1;
            const winnerAddress = "0x724CB381dA11ffeaad545de719cA6dD9accD27Fc".toLowerCase();
            const winnerAmount = 9999;

            // When
            handleAuctionSettled(
                generateAuctionSettledEvent(vault.id, tokenAddress, tokenId, winnerAddress, winnerAmount)
            );

            // Then
            assert.notInStore("Nounlet", tokenId.toString());
            assert.notInStore("Auction", tokenId.toString());
        });

        test("Should set an auction as settled when settling an auction", () => {
            // Given
            const tokenAddress = "0xd8dE7B1CF394DDa77DFB5A45A5653b7A39B6ec5d".toLowerCase();
            const token = findOrCreateToken(tokenAddress);
            const vault = new Vault("0x481b8D3E615eF2b339F816A98Ac0fE363D881f3f".toLowerCase());
            vault.noun = "1";
            vault.token = token.id;
            vault.save();
            const tokenId = 1;
            const auction = new Auction(generateAuctionId(tokenAddress, tokenId.toString()));
            auction.nounlet = tokenId.toString();
            auction.settled = false;
            auction.settledTransactionHash = ZERO_ADDRESS;
            auction.highestBidAmount = BigInt.fromI32(0);
            auction.highestBidder = null;
            auction.startTime = BigInt.fromI64(1657873934 as i64);
            auction.endTime = BigInt.fromI64(1672273934 as i64);
            auction.save();
            const nounlet = new Nounlet(generateNounletId(tokenAddress, tokenId.toString()));
            nounlet.noun = vault.noun as string;
            nounlet.auction = auction.id;
            nounlet.save();
            const winnerAddress = "0x724CB381dA11ffeaad545de719cA6dD9accD27Fc".toLowerCase();
            const winnerAmount = 9999;

            // When
            handleAuctionSettled(
                generateAuctionSettledEvent(vault.id, tokenAddress, tokenId, winnerAddress, winnerAmount)
            );

            // Then
            assert.fieldEquals("Auction", auction.id, "settled", "true");
            assert.fieldEquals(
                "Auction",
                auction.id,
                "highestBidder",
                generateAccountId(winnerAddress.toString(), tokenAddress)
            );
            assert.fieldEquals("Auction", auction.id, "highestBidAmount", winnerAmount.toString());
        });

        test("Should save a nounlet to an account when settling an auction", () => {
            // Given
            const tokenAddress = "0x20Cb1aA46f710115e2591474d0a00f3F28bcc9ef".toLowerCase();
            const token = findOrCreateToken(tokenAddress);
            const vault = new Vault("0x481b8D3E615eF2b339F816A98Ac0fE363D881f3f".toLowerCase());
            vault.noun = "1";
            vault.token = token.id;
            vault.save();
            const tokenId = 1;
            const nounlet = new Nounlet(generateNounletId(tokenAddress, tokenId.toString()));
            nounlet.noun = vault.noun as string;
            nounlet.save();
            const auction = new Auction(generateAuctionId(tokenAddress, tokenId.toString()));
            auction.nounlet = nounlet.id;
            auction.settled = false;
            auction.settledTransactionHash = ZERO_ADDRESS;
            auction.highestBidAmount = BigInt.fromI32(0);
            auction.highestBidder = null;
            auction.startTime = BigInt.fromI64(1657873934 as i64);
            auction.endTime = BigInt.fromI64(1672273934 as i64);
            auction.save();
            const winnerAddress = "0x724CB381dA11ffeaad545de719cA6dD9accD27Fc".toLowerCase();
            const winnerAmount = 9999;

            // When
            handleAuctionSettled(
                generateAuctionSettledEvent(vault.id, tokenAddress, tokenId, winnerAddress, winnerAmount)
            );

            // Then
            const winnerId = generateAccountId(winnerAddress.toString(), tokenAddress);
            assert.fieldEquals("Nounlet", nounlet.id, "holder", winnerId);
            assert.fieldEquals("Nounlet", nounlet.id, "delegate", generateDelegateId(winnerAddress, tokenAddress));
            assert.fieldEquals("Account", winnerId, "nounletsHeldIDs", `[${nounlet.id}]`);
            assert.fieldEquals("Account", winnerId, "nounletsHeld", `[${nounlet.id}]`);
            const winner = Account.load(winnerId) as Account;
            assert.stringEquals([nounlet.id].toString(), winner.nounletsHeld.toString());
            // assert.fieldEquals("Account", winnerAddress, "nounlets", `[${tokenId.toString()}]`);
        });

        test("Should not duplicate hald nounlet IDs when saving nounlets to an account", () => {
            // Given
            const tokenAddress = "0x20Cb1aA46f710115e2591474d0a00f3F28bcc9ef".toLowerCase();
            const token = findOrCreateToken(tokenAddress);
            const vault = new Vault("0x481b8D3E615eF2b339F816A98Ac0fE363D881f3f".toLowerCase());
            vault.noun = "1";
            vault.token = token.id;
            vault.save();
            const tokenId = 1;
            const nounlet = new Nounlet(generateNounletId(tokenAddress, tokenId.toString()));
            nounlet.noun = vault.noun as string;
            nounlet.save();
            const auction = new Auction(generateAuctionId(tokenAddress, tokenId.toString()));
            auction.nounlet = nounlet.id;
            auction.settled = false;
            auction.settledTransactionHash = ZERO_ADDRESS;
            auction.highestBidAmount = BigInt.fromI32(0);
            auction.highestBidder = null;
            auction.startTime = BigInt.fromI64(1657873934 as i64);
            auction.endTime = BigInt.fromI64(1672273934 as i64);
            auction.save();
            const winnerAddress = "0x724CB381dA11ffeaad545de719cA6dD9accD27Fc".toLowerCase();
            const winnerAmount = 9999;

            // When
            handleAuctionSettled(
                generateAuctionSettledEvent(vault.id, tokenAddress, tokenId, winnerAddress, winnerAmount)
            );
            handleAuctionSettled(
                generateAuctionSettledEvent(vault.id, tokenAddress, tokenId, winnerAddress, winnerAmount)
            );

            // Then
            const winnerId = generateAccountId(winnerAddress.toString(), tokenAddress);
            assert.fieldEquals("Account", winnerId, "nounletsHeldIDs", `[${nounlet.id}]`);
        });

        test("Should make an auction holder a default nounlet delegate when settling an auction", () => {
            // Given
            const tokenAddress = "0xd8dE7B1CF394DDa77DFB5A45A5653b7A39B6ec5d".toLowerCase();
            const token = findOrCreateToken(tokenAddress);
            const nounId = "1";
            const vault = new Vault("0x481b8D3E615eF2b339F816A98Ac0fE363D881f3f".toLowerCase());
            vault.noun = nounId;
            vault.token = token.id;
            vault.save();
            const tokenId = 1;
            const auction = new Auction(generateAuctionId(tokenAddress, tokenId.toString()));
            auction.nounlet = tokenId.toString();
            auction.settled = false;
            auction.settledTransactionHash = ZERO_ADDRESS;
            auction.highestBidAmount = BigInt.fromI32(0);
            auction.highestBidder = null;
            auction.startTime = BigInt.fromI64(1657873934 as i64);
            auction.endTime = BigInt.fromI64(1672273934 as i64);
            auction.save();
            const nounlet = new Nounlet(generateNounletId(tokenAddress, tokenId.toString()));
            nounlet.noun = vault.noun as string;
            nounlet.auction = auction.id;
            nounlet.save();
            const winnerAddress = "0x724CB381dA11ffeaad545de719cA6dD9accD27Fc".toLowerCase();
            const winnerAmount = 9999;

            // When
            handleAuctionSettled(
                generateAuctionSettledEvent(vault.id, tokenAddress, tokenId, winnerAddress, winnerAmount)
            );

            // Then
            const delegateId = generateDelegateId(winnerAddress, tokenAddress);
            assert.fieldEquals("Delegate", delegateId, "nounletsRepresented", `[${nounlet.id}]`);
        });

        test("Should settle an auction even if a nounlet is not present in the store but the vault contains a noun", () => {
            // Given
            const tokenAddress = "0xd8dE7B1CF394DDa77DFB5A45A5653b7A39B6ec5d".toLowerCase();
            const token = findOrCreateToken(tokenAddress);
            const vault = new Vault("0x481b8D3E615eF2b339F816A98Ac0fE363D881f3f".toLowerCase());
            vault.noun = "1";
            vault.token = token.id;
            vault.save();
            const tokenId = 1;
            const auction = new Auction(generateAuctionId(tokenAddress, tokenId.toString()));
            auction.nounlet = tokenId.toString();
            auction.settled = false;
            auction.settledTransactionHash = ZERO_ADDRESS;
            auction.highestBidAmount = BigInt.fromI32(0);
            auction.highestBidder = null;
            auction.startTime = BigInt.fromI64(1657873934 as i64);
            auction.endTime = BigInt.fromI64(1672273934 as i64);
            auction.save();
            const winnerAddress = "0x724CB381dA11ffeaad545de719cA6dD9accD27Fc".toLowerCase();
            const winnerAmount = 9999;

            // When
            handleAuctionSettled(
                generateAuctionSettledEvent(vault.id, tokenAddress, tokenId, winnerAddress, winnerAmount)
            );

            // Then
            assert.fieldEquals("Auction", auction.id, "settled", "true");
            assert.fieldEquals(
                "Auction",
                auction.id,
                "highestBidder",
                generateAccountId(winnerAddress.toString(), tokenAddress)
            );
            assert.fieldEquals("Auction", auction.id, "highestBidAmount", winnerAmount.toString());
        });
    });
});
