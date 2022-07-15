import { assert, beforeEach, describe, test } from "matchstick-as/assembly";
import { clearStore } from "matchstick-as";
import {
    handleAuctionBid,
    handleAuctionCreated,
    handleAuctionExtended,
    handleAuctionSettled,
} from "../src/nounlet-auction";
import {
    generateAuctionBidEvent,
    generateAuctionCreatedEvent,
    generateAuctionExtendedEvent,
    generateAuctionSettledEvent,
} from "./mock-event-generator";
import { BigInt } from "@graphprotocol/graph-ts";
import { Auction, Vault } from "../generated/schema";
import { now as Date_now } from "assemblyscript/std/assembly/bindings/Date";

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
            const vault = new Vault("0x481b8D3E615eF2b339F816A98Ac0fE363D881f3f".toLowerCase());
            // Vault noun not defined
            vault.save();
            const tokenAddress = "0xd8dE7B1CF394DDa77DFB5A45A5653b7A39B6ec5d".toLowerCase();
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
            const vault = new Vault("0x481b8D3E615eF2b339F816A98Ac0fE363D881f3f".toLowerCase());
            vault.noun = "1";
            vault.save();
            const tokenAddress = "0xd8dE7B1CF394DDa77DFB5A45A5653b7A39B6ec5d".toLowerCase();
            const tokenId = BigInt.fromI32(1);
            const startTime = BigInt.fromI64(1657873934 as i64);
            // Set auction length of 4 hours
            const endTime = BigInt.fromI64(1672273934 as i64);

            // When
            handleAuctionCreated(generateAuctionCreatedEvent(vault.id, tokenAddress, tokenId, startTime, endTime));
            const nounletId = tokenId.toString();

            // Then
            assert.fieldEquals("Seed", nounletId, "id", nounletId);
            assert.fieldEquals("Nounlet", nounletId, "id", nounletId);
            assert.fieldEquals("Nounlet", nounletId, "seed", nounletId);
            assert.fieldEquals("Auction", nounletId, "id", nounletId);
            assert.fieldEquals("Auction", nounletId, "startTime", startTime.toString());
            assert.fieldEquals("Auction", nounletId, "endTime", endTime.toString());
            assert.fieldEquals("Auction", nounletId, "amount", "0");
            assert.fieldEquals("Auction", nounletId, "settled", "false");
        });
    });

    describe("Auction Extended Handler", () => {
        test("Should not extend an auction if there is no auction for a Nounlet to extend", () => {
            // Given
            const vault = new Vault("0x481b8D3E615eF2b339F816A98Ac0fE363D881f3f".toLowerCase());
            vault.noun = "1";
            vault.save();
            const tokenAddress = "0xd8dE7B1CF394DDa77DFB5A45A5653b7A39B6ec5d".toLowerCase();
            const tokenId = BigInt.fromI32(1);
            // Extend auction for 10 min
            const endTime = BigInt.fromI64(1672873934 as i64);

            // When
            handleAuctionExtended(generateAuctionExtendedEvent(vault.id, tokenAddress, tokenId, endTime));

            // Then
            assert.notInStore("Nounlet", tokenId.toString());
            assert.notInStore("Auction", tokenId.toString());
        });

        test("Should not extend an auction if it is already settled", () => {
            // Given
            const vault = new Vault("0x481b8D3E615eF2b339F816A98Ac0fE363D881f3f".toLowerCase());
            vault.noun = "1";
            vault.save();
            const tokenId = BigInt.fromI32(1);
            const auction = new Auction(tokenId.toString());
            auction.nounlet = tokenId.toString();
            auction.settled = true;
            auction.amount = BigInt.fromI32(0);
            auction.bidder = null;
            auction.startTime = BigInt.fromI64(1657873934 as i64);
            auction.endTime = BigInt.fromI64(1672273934 as i64);
            auction.save();
            const tokenAddress = "0xd8dE7B1CF394DDa77DFB5A45A5653b7A39B6ec5d".toLowerCase();
            // Extend auction for 10 min
            const endTime = BigInt.fromI64(1672873934 as i64);

            // When
            handleAuctionExtended(generateAuctionExtendedEvent(vault.id, tokenAddress, tokenId, endTime));
            const nounletId = tokenId.toString();

            // Then
            assert.fieldEquals("Auction", auction.id, "endTime", auction.endTime.toString());
        });

        test("Should extend an auction by updating an endTime", () => {
            // Given
            const vault = new Vault("0x481b8D3E615eF2b339F816A98Ac0fE363D881f3f".toLowerCase());
            vault.noun = "1";
            vault.save();
            const tokenId = BigInt.fromI32(1);
            const auction = new Auction(tokenId.toString());
            auction.nounlet = tokenId.toString();
            auction.settled = false;
            auction.amount = BigInt.fromI32(0);
            auction.bidder = null;
            auction.startTime = BigInt.fromI64(1657873934 as i64);
            auction.endTime = BigInt.fromI64(1672273934 as i64);
            auction.save();
            const tokenAddress = "0xd8dE7B1CF394DDa77DFB5A45A5653b7A39B6ec5d".toLowerCase();
            // Extend auction for 10 min
            const endTime = BigInt.fromI64(1672873934 as i64);

            // When
            handleAuctionExtended(generateAuctionExtendedEvent(vault.id, tokenAddress, tokenId, endTime));
            const nounletId = tokenId.toString();

            // Then
            assert.fieldEquals("Auction", nounletId, "endTime", endTime.toString());
        });
    });

    describe("Auction Bid Handler", () => {
        test("Should prevent a bid if there is no auction", () => {
            // Given
            const vault = new Vault("0x481b8D3E615eF2b339F816A98Ac0fE363D881f3f".toLowerCase());
            vault.noun = "1";
            vault.save();
            const transactionId = "0xddb9addf21f868bb0804d7ea09ffdaa001390adf2e180210f7b32f2c46856f0f";
            const tokenAddress = "0xd8dE7B1CF394DDa77DFB5A45A5653b7A39B6ec5d".toLowerCase();
            const tokenId = 1;
            const bidderAddress = "0x5Bf1d2a415561A2F225F4523f3cbf552a6c692B7".toLowerCase();
            const bidAmount = 1234;

            // When
            handleAuctionBid(
                generateAuctionBidEvent(transactionId, vault.id, tokenAddress, tokenId, bidderAddress, bidAmount, false)
            );

            // Then
            assert.notInStore("Bid", transactionId);
        });

        test("Should prevent a bid if an auction is already settled", () => {
            // Given
            const vault = new Vault("0x481b8D3E615eF2b339F816A98Ac0fE363D881f3f".toLowerCase());
            vault.noun = "1";
            vault.save();
            const tokenId = 1;
            const auction = new Auction(tokenId.toString());
            auction.nounlet = tokenId.toString();
            auction.settled = true;
            auction.amount = BigInt.fromI32(0);
            auction.bidder = null;
            auction.startTime = BigInt.fromI64(1657873934 as i64);
            auction.endTime = BigInt.fromI64(1672273934 as i64);
            auction.save();
            const transactionId = "0xddb9addf21f868bb0804d7ea09ffdaa001390adf2e180210f7b32f2c46856f0f";
            const tokenAddress = "0xd8dE7B1CF394DDa77DFB5A45A5653b7A39B6ec5d".toLowerCase();
            const bidderAddress = "0x5Bf1d2a415561A2F225F4523f3cbf552a6c692B7".toLowerCase();
            const bidAmount = 1234;

            // When
            handleAuctionBid(
                generateAuctionBidEvent(transactionId, vault.id, tokenAddress, tokenId, bidderAddress, bidAmount, false)
            );

            // Then
            assert.fieldEquals("Auction", auction.id, "bidder", "null");
            assert.fieldEquals("Auction", auction.id, "amount", "0");
            assert.notInStore("Bid", transactionId);
        });

        test("Should process an auction bid", () => {
            // Given
            const vault = new Vault("0x481b8D3E615eF2b339F816A98Ac0fE363D881f3f".toLowerCase());
            vault.noun = "1";
            vault.save();
            const tokenId = 1;
            const auction = new Auction(tokenId.toString());
            auction.nounlet = tokenId.toString();
            auction.settled = false;
            auction.amount = BigInt.fromI32(0);
            auction.bidder = null;
            auction.startTime = BigInt.fromI64(1657873934 as i64);
            auction.endTime = BigInt.fromI64(1672273934 as i64);
            auction.save();
            const transactionId = "0xddb9addf21f868bb0804d7ea09ffdaa001390adf2e180210f7b32f2c46856f0f";
            const tokenAddress = "0xd8dE7B1CF394DDa77DFB5A45A5653b7A39B6ec5d".toLowerCase();
            const bidderAddress = "0x5Bf1d2a415561A2F225F4523f3cbf552a6c692B7".toLowerCase();
            const bidAmount = 1234;

            // When
            handleAuctionBid(
                generateAuctionBidEvent(transactionId, vault.id, tokenAddress, tokenId, bidderAddress, bidAmount, false)
            );

            // Then
            assert.fieldEquals("Auction", auction.id, "bidder", bidderAddress);
            assert.fieldEquals("Auction", auction.id, "amount", bidAmount.toString());
            assert.fieldEquals("Bid", transactionId, "auction", auction.id);
            assert.fieldEquals("Bid", transactionId, "bidder", bidderAddress);
            assert.fieldEquals("Bid", transactionId, "amount", bidAmount.toString());
        });
    });

    describe("Auction Settled Handler", () => {
        test("Should not settle an auction if an auction does not exist", () => {
            // Given
            const vault = new Vault("0x481b8D3E615eF2b339F816A98Ac0fE363D881f3f".toLowerCase());
            vault.noun = "1";
            vault.save();
            const tokenAddress = "0xd8dE7B1CF394DDa77DFB5A45A5653b7A39B6ec5d".toLowerCase();
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

        test("Should settle an auction", () => {
            // Given
            const vault = new Vault("0x481b8D3E615eF2b339F816A98Ac0fE363D881f3f".toLowerCase());
            vault.noun = "1";
            vault.save();
            const tokenId = 1;
            const auction = new Auction(tokenId.toString());
            auction.nounlet = tokenId.toString();
            auction.settled = false;
            auction.amount = BigInt.fromI32(0);
            auction.bidder = null;
            auction.startTime = BigInt.fromI64(1657873934 as i64);
            auction.endTime = BigInt.fromI64(1672273934 as i64);
            auction.save();
            const tokenAddress = "0xd8dE7B1CF394DDa77DFB5A45A5653b7A39B6ec5d".toLowerCase();
            const winnerAddress = "0x724CB381dA11ffeaad545de719cA6dD9accD27Fc".toLowerCase();
            const winnerAmount = 9999;

            // When
            handleAuctionSettled(
                generateAuctionSettledEvent(vault.id, tokenAddress, tokenId, winnerAddress, winnerAmount)
            );

            // Then
            assert.fieldEquals("Auction", tokenId.toString(), "settled", "true");
            assert.fieldEquals("Auction", tokenId.toString(), "bidder", winnerAddress.toString());
            assert.fieldEquals("Auction", tokenId.toString(), "amount", winnerAmount.toString());
        });
    });
});
