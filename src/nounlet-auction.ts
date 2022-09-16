import {
    Bid as AuctionBidEvent,
    Created as AuctionCreatedEvent,
    Settled as AuctionSettledEvent,
} from "../generated/NounletAuction/NounletAuction";
import { Auction, Bid, Delegate, DelegateVote, Nounlet, Vault } from "../generated/schema";
import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import {
    findOrCreateAccount,
    findOrCreateDelegate,
    findOrNewAccount,
    findOrNewDelegate,
    findOrNewDelegateVote,
    findOrNewNounlet,
    findOrNewVault,
    generateAuctionId,
    generateDelegateVoteId,
    generateNounletId,
    getDistinctValues,
} from "./utils/helpers";
import { ZERO_ADDRESS } from "./utils/constants";
import { NounletToken } from "../generated/NounletToken/NounletToken";

export function handleAuctionCreated(event: AuctionCreatedEvent): void {
    log.debug("[handleAuctionCreated] _token: {}, _id: {}, _vault: {}, start time: {}, _endTime: {}", [
        event.params._token.toHexString(),
        event.params._id.toString(),
        event.params._vault.toHexString(),
        event.block.timestamp.toString(),
        event.params._endTime.toString(),
    ]);

    const vaultId: string = event.params._vault.toHexString();
    const tokenId: string = event.params._id.toString();
    const tokenAddress: string = event.params._token.toHexString();
    const startTime: BigInt = event.block.timestamp;
    const endTime: BigInt = event.params._endTime;
    const nounletId: string = generateNounletId(tokenAddress, tokenId);

    const vault = Vault.load(vaultId);
    if (vault === null) {
        log.error("[handleAuctionCreated] Vault not found: {}. Hash: {}", [
            vaultId,
            event.transaction.hash.toHexString(),
        ]);
        return;
    }

    const nounId = vault.noun;
    if (nounId === null) {
        log.error("[handleAuctionCreated] Vault {} does not contain a Noun. Hash: {}", [
            vaultId,
            event.transaction.hash.toHexString(),
        ]);
        return;
    }

    // Store the nounlet
    const nounlet = new Nounlet(nounletId);
    nounlet.noun = nounId;
    nounlet.save();
    // Store the auction
    const auction = new Auction(nounletId);
    auction.nounlet = nounlet.id;
    auction.highestBidAmount = BigInt.fromI32(0);
    auction.settled = false;
    auction.settledTransactionHash = ZERO_ADDRESS;
    auction.startTime = startTime;
    auction.endTime = endTime;
    auction.save();
}

export function handleAuctionBid(event: AuctionBidEvent): void {
    log.debug("[handleAuctionBid] _token: {}, _id: {}, _bidder: {}, _value: {}, _endTime: {}, Bid ID: {}", [
        event.params._token.toHexString(),
        event.params._id.toString(),
        event.params._bidder.toHexString(),
        event.params._value.toString(),
        event.params._endTime.toString(),
        event.transaction.hash.toHexString(),
    ]);

    const tokenAddress = event.params._token.toHexString();
    const tokenId = event.params._id.toString();
    const auctionId = generateAuctionId(tokenAddress, tokenId);
    const bidderAddress = event.params._bidder.toHexString();
    const bidAmount = event.params._value;
    const endTime = event.params._endTime;
    const bidId = event.transaction.hash.toHexString();

    const auction = Auction.load(auctionId);
    if (auction === null) {
        log.error("[handleAuctionBid] Auction not found for Nounlet #{}. Hash: {}", [
            auctionId,
            event.transaction.hash.toHexString(),
        ]);
        return;
    }

    const bidder = findOrCreateAccount(bidderAddress, tokenAddress);

    auction.highestBidder = bidder.id;
    auction.highestBidAmount = bidAmount;
    auction.endTime = endTime;
    auction.save();

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
    // log.debug("[handleAuctionSettled] _token: {}, _id: {}, _vault: {}, _amount: {}, _winner: {}", [
    //     event.params._token.toHexString(),
    //     event.params._id.toString(),
    //     event.params._vault.toHexString(),
    //     event.params._amount.toString(),
    //     event.params._winner.toHexString(),
    // ]);

    const transactionHash = event.transaction.hash.toHexString();
    const vaultId = event.params._vault.toHexString();
    const tokenAddress = event.params._token.toHexString();
    const tokenId = event.params._id.toString();
    const auctionId = generateAuctionId(tokenAddress, tokenId);
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
    const nounlet = attemptNounAssignment(findOrNewNounlet(tokenId, tokenAddress), vaultId);
    if (nounlet.noun === null) {
        log.error("[handleAuctionSettled] Cannot find a Noun for Nounlet #{}. Hash: {}", [
            auctionId,
            event.transaction.hash.toHexString(),
        ]);
        return;
    }

    // Update Account with token holdings info
    const account = findOrNewAccount(winnerAddress, tokenAddress);
    let nounletsHeldIDs = account.nounletsHeldIDs;
    nounletsHeldIDs.push(nounlet.id);
    account.nounletsHeldIDs = getDistinctValues(nounletsHeldIDs);

    let delegate: Delegate;
    // Try to fetch the current delegate from Blockchain
    const contract = NounletToken.bind(Address.fromString(tokenAddress));
    const delegateAddress = contract.try_delegates(Address.fromString(winnerAddress));
    if (delegateAddress.reverted) {
        // Select a Delegate of the settled Nounlet
        if (account.delegate === null) {
            // Delegate is also a holder
            delegate = findOrNewDelegate(winnerAddress, tokenAddress);
        } else {
            // Holder already delegated their Nounlets, so this one also gets delegated to that same Delegate
            const delegateId = (account.delegate as string).replace(tokenAddress, "").replace("-", "");
            delegate = findOrNewDelegate(delegateId, tokenAddress);
        }
    } else {
        delegate = findOrNewDelegate(delegateAddress.value.toHexString(), tokenAddress);
    }
    account.delegate = delegate.id;
    account.save();

    const nounletsRepresentedIDs = delegate.nounletsRepresentedIDs;
    nounletsRepresentedIDs.push(nounlet.id);
    delegate.nounletsRepresentedIDs = getDistinctValues(nounletsRepresentedIDs);
    delegate.save();

    // Settle auction
    auction.settled = true;
    auction.settledTransactionHash = transactionHash;
    auction.highestBidAmount = amount;
    auction.highestBidder = account.id;
    auction.save();

    // Set nounlet holder and default delegate
    nounlet.holder = account.id;
    nounlet.delegate = delegate.id;
    nounlet.save();

    const delegateVote = findOrNewDelegateVote(delegate.id, nounlet.id);
    delegateVote.delegator = account.id;
    delegateVote.delegate = delegate.id;
    delegateVote.nounlet = nounlet.id;
    delegateVote.reason = "Auction Settled";
    delegateVote.timestamp = event.block.timestamp;
    delegateVote.voteAmount = BigInt.fromI32(1);
    delegateVote.save();
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
