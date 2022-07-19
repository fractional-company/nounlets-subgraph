import {
    AuctionBid as AuctionBidEvent,
    AuctionCreated as AuctionCreatedEvent,
    AuctionExtended as AuctionExtendedEvent,
    AuctionSettled as AuctionSettledEvent,
} from "../generated/NounletAuction/NounletAuction";
import { Auction, Bid, Nounlet, Seed, Vault } from "../generated/schema";
import { BigInt, log } from "@graphprotocol/graph-ts";
import { findOrCreateAccount, findOrNewAccount } from "./utils/helpers";

export function handleAuctionCreated(event: AuctionCreatedEvent): void {
    const vaultId: string = event.params._vault.toHexString();
    const nounletId: string = event.params._id.toString();
    const startTime: BigInt = event.params._startTime;
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

    // Store the seed of the nounlet
    const seed = new Seed(nounletId);
    // TODO: Call NounletToken contract (generateSeed(tokenId) getter) to fetch the nounlet seed.
    seed.save();
    // Store the nounlet
    const nounlet = new Nounlet(nounletId);
    nounlet.noun = noun;
    nounlet.seed = seed.id;
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

export function handleAuctionExtended(event: AuctionExtendedEvent): void {
    const auctionId = event.params._id.toString();
    const endTime = event.params._endTime;

    const auction = Auction.load(auctionId);
    if (auction === null) {
        log.error("[handleAuctionExtended] Auction not found for Nounlet #{}. Hash: {}", [
            auctionId,
            event.transaction.hash.toHexString(),
        ]);
        return;
    }

    if (auction.settled) {
        log.error("[handleAuctionExtended] Auction {} is settled and cannot be extended. Hash: {}", [
            auctionId,
            event.transaction.hash.toHexString(),
        ]);
        return;
    }

    auction.endTime = endTime;
    auction.save();
}

export function handleAuctionBid(event: AuctionBidEvent): void {
    const auctionId = event.params._id.toString();
    const bidderAddress = event.params._sender.toHexString();
    const bidAmount = event.params._value;
    const bidId = event.transaction.hash.toHexString();

    const auction = Auction.load(auctionId);
    if (auction === null) {
        log.error("[handleAuctionBid] Auction not found for Nounlet #{}. Hash: {}", [
            auctionId,
            event.transaction.hash.toHexString(),
        ]);
        return;
    }
    if (auction.settled) {
        log.error("[handleAuctionExtended] Cannot bid on an Auction {} as it is already settled. Hash: {}", [
            auctionId,
            event.transaction.hash.toHexString(),
        ]);
        return;
    }
    auction.bidder = bidderAddress;
    auction.amount = bidAmount;
    auction.save();

    const bidder = findOrCreateAccount(bidderAddress);

    const bid = new Bid(bidId);
    bid.auction = auction.id;
    bid.bidder = bidder.id;
    bid.amount = bidAmount;
    bid.blockNumber = event.block.number;
    bid.blockTimestamp = event.block.timestamp;
    bid.save();
}

export function handleAuctionSettled(event: AuctionSettledEvent): void {
    const auctionId = event.params._id.toString();
    const amount = event.params._amount;
    const winnerAddress = event.params._winner.toHexString();

    const account = findOrNewAccount(winnerAddress);
    const accountNounlets = account.nounlets;
    accountNounlets.push(auctionId);
    account.nounlets = accountNounlets;
    account.totalTokensHeld = account.totalTokensHeld.plus(BigInt.fromI32(1));
    account.totalTokensHeldRaw = account.totalTokensHeldRaw.plus(BigInt.fromI32(1));
    account.tokenBalance = BigInt.fromI32(accountNounlets.length);
    account.tokenBalanceRaw = BigInt.fromI32(accountNounlets.length);
    account.save();

    const auction = Auction.load(auctionId);
    if (auction === null) {
        log.error("[handleAuctionSettled] Auction not found for Nounlet #{}. Hash: {}", [
            auctionId,
            event.transaction.hash.toHexString(),
        ]);
        return;
    }
    auction.settled = true;
    auction.amount = amount;
    auction.bidder = account.id;
    auction.save();
}
