import {
    Bid as AuctionBidEvent,
    Created as AuctionCreatedEvent,
    Settled as AuctionSettledEvent,
} from "../generated/NounletAuction/NounletAuction";
import { Auction, Bid, Nounlet, Vault } from "../generated/schema";
import { BigInt, log } from "@graphprotocol/graph-ts";
import {
    findOrCreateAccount,
    findOrNewAccount,
    findOrNewDelegate,
    findOrNewNounlet,
    findOrNewVault,
} from "./utils/helpers";

export function handleAuctionCreated(event: AuctionCreatedEvent): void {
    const vaultId: string = event.params._vault.toHexString();
    const nounletId: string = event.params._id.toString();
    const startTime: BigInt = event.block.timestamp;
    const endTime: BigInt = event.params._endTime;

    const vault = Vault.load(vaultId);
    if (vault === null) {
        log.error("[handleAuctionCreated] Vault not found: {}. Hash: {}", [
            vaultId,
            event.transaction.hash.toHexString(),
        ]);
        return;
    }

    const noun = vault.noun;
    if (noun === null) {
        log.error("[handleAuctionCreated] Vault {} does not contain a Noun. Hash: {}", [
            vaultId,
            event.transaction.hash.toHexString(),
        ]);
        return;
    }

    // Store the nounlet
    const nounlet = new Nounlet(nounletId);
    nounlet.noun = noun;
    nounlet.save();
    // Store the auction
    const auction = new Auction(nounletId);
    auction.nounlet = nounlet.id;
    auction.amount = BigInt.fromI32(0);
    auction.settled = false;
    auction.startTime = startTime;
    auction.endTime = endTime;
    auction.save();
}

export function handleAuctionBid(event: AuctionBidEvent): void {
    const auctionId = event.params._id.toString();
    const bidderAddress = event.params._bidder.toHexString();
    const bidAmount = event.params._value;
    const endTime = event.params._extendedTime;
    const bidId = event.transaction.hash.toHexString();

    const auction = Auction.load(auctionId);
    if (auction === null) {
        log.error("[handleAuctionBid] Auction not found for Nounlet #{}. Hash: {}", [
            auctionId,
            event.transaction.hash.toHexString(),
        ]);
        return;
    }
    auction.bidder = bidderAddress;
    auction.amount = bidAmount;
    auction.endTime = endTime;
    auction.save();

    const bidder = findOrCreateAccount(bidderAddress);

    const bid = new Bid(bidId);
    bid.auction = auction.id;
    bid.bidder = bidder.id;
    bid.amount = bidAmount;
    bid.blockNumber = event.block.number;
    bid.blockTimestamp = event.block.timestamp;
    bid.txIndex = event.transaction.index;
    bid.save();
}

export function handleAuctionSettled(event: AuctionSettledEvent): void {
    const vaultId = event.params._vault.toHexString();
    const auctionId = event.params._id.toString();
    const amount = event.params._amount;
    const winnerAddress = event.params._winner.toHexString();

    // Verify auction existence
    const auction = Auction.load(auctionId);
    if (auction === null) {
        log.error("[handleAuctionSettled] Auction not found for Nounlet #{}. Hash: {}", [
            auctionId,
            event.transaction.hash.toHexString(),
        ]);
        return;
    }

    // Verify noun existence
    const nounlet = attemptNounAssignment(findOrNewNounlet(auctionId), vaultId);
    if (nounlet.noun === null) {
        log.error("[handleAuctionSettled] Cannot find a Noun for Nounlet #{}. Hash: {}", [
            auctionId,
            event.transaction.hash.toHexString(),
        ]);
        return;
    }

    // Update Account with token holdings info
    const account = findOrNewAccount(winnerAddress);
    account.totalNounletsHeld = account.totalNounletsHeld.plus(BigInt.fromI32(1));
    account.save();

    // Create a delegate if not found in the store (nounlet holder is a nounlet delegate by default)
    const delegate = findOrNewDelegate(winnerAddress, nounlet.noun as string);
    delegate.save();

    // Settle auction
    auction.settled = true;
    auction.amount = amount;
    auction.bidder = winnerAddress;
    auction.save();

    // Set nounlet holder and default delegate
    nounlet.holder = winnerAddress;
    nounlet.delegate = delegate.id;
    nounlet.save();
}

function attemptNounAssignment(nounlet: Nounlet, vaultId: string): Nounlet {
    if (nounlet.noun !== null) {
        return nounlet;
    }

    const vault = findOrNewVault(vaultId);
    if (vault.noun !== null) {
        nounlet.noun = vault.noun as string;
    }

    return nounlet;
}
