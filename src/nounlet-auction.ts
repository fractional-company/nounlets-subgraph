import {
    AuctionBid as AuctionBidEvent,
    AuctionCreated as AuctionCreatedEvent,
    AuctionExtended as AuctionExtendedEvent,
    AuctionSettled as AuctionSettledEvent,
} from "../generated/NounletAuction/NounletAuction";
import { Auction, Bid, Noun, Nounlet, Vault } from "../generated/schema";
import { BigInt, log, dataSource } from "@graphprotocol/graph-ts";
import {
    findOrCreateAccount,
    findOrCreateDelegate,
    findOrNewAccount,
    findOrNewDelegate,
    findOrNewDelegateVote,
    findOrNewNounlet,
    findOrNewSeed,
    findOrNewVault,
    UNDEFINED_ID,
} from "./utils/helpers";

// TODO: Contract addresses for fetching Seed go here
const NOUNLET_METADATA_CONTRACT_RINKEBY = "";
const NOUNLET_METADATA_CONTRACT_MAINNET = "";

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

    log.info("Current chain: {}", [dataSource.network()]);

    // Store the seed of the nounlet
    const seed = findOrNewSeed(nounletId);
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

    const nounlet = findOrNewNounlet(auctionId);
    if (nounlet.noun === null) {
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
    const vaultId = event.params._vault.toHexString();
    const auctionId = event.params._id.toString();
    const bidderAddress = event.params._sender.toHexString();
    const bidAmount = event.params._value;
    const bidId = event.transaction.hash.toHexString();

    const nounlet = attemptNounAssignment(findOrNewNounlet(auctionId), vaultId);
    if (nounlet.noun === UNDEFINED_ID) {
        log.error("[handleAuctionBid] Cannot find a Noun for Nounlet #{}. Hash: {}", [
            auctionId,
            event.transaction.hash.toHexString(),
        ]);
        return;
    }

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
    if (nounlet.noun === UNDEFINED_ID) {
        log.error("[handleAuctionSettled] Cannot find a Noun for Nounlet #{}. Hash: {}", [
            auctionId,
            event.transaction.hash.toHexString(),
        ]);
        return;
    }

    // Create a delegate if not found in the store (nounlet holder is a nounlet delegate by default)
    const delegate = findOrNewDelegate(winnerAddress, nounlet.noun);
    delegate.delegatedVotes = delegate.delegatedVotes.plus(BigInt.fromI32(1));
    delegate.nounletsRepresentedAmount = delegate.nounletsRepresentedAmount.plus(BigInt.fromI32(1));
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

    // Update Account with token holdings info
    const account = findOrNewAccount(winnerAddress);
    const accountNounlets = account.nounlets;
    accountNounlets.push(auctionId);
    account.nounlets = accountNounlets;
    account.totalNounletsHeld = account.totalNounletsHeld.plus(BigInt.fromI32(1));
    account.nounletBalance = BigInt.fromI32(account.nounlets.length);
    account.nounletBalanceRaw = BigInt.fromI32(account.nounlets.length);
    account.save();
}

function attemptNounAssignment(nounlet: Nounlet, vaultId: string): Nounlet {
    if (nounlet.noun !== UNDEFINED_ID) {
        return nounlet;
    }

    const vault = findOrNewVault(vaultId);
    if (vault.noun !== null) {
        nounlet.noun = vault.noun as string;
    }

    return nounlet;
}
