import {
    DelegateChanged as DelegateChangedEvent,
    DelegateVotesChanged as DelegateVotesChangedEvent,
    TransferBatch as TransferBatchEvent,
    TransferSingle as TransferSingleEvent,
} from "../generated/NounletToken/NounletToken";
import {
    findOrCreateDelegate,
    findOrNewDelegate,
    findOrNewDelegateVote,
    findOrNewNounlet,
    generateNounletId,
    transferBatchOfNounlets,
} from "./utils/helpers";
import { Nounlet } from "../generated/schema";
import { log } from "@graphprotocol/graph-ts";

let nounletId: string;
export function handleDelegateChanged(event: DelegateChangedEvent): void {
    const fromDelegateAddress = event.params._fromDelegate.toHexString();
    const toDelegateAddress = event.params._toDelegate.toHexString();
    const tokenAddress = event.address.toHexString();
    const tokenAddress2 = event.transaction.from.toHexString();
    const tokenAddress3 = event.block.author.toHexString();
    const tokenId = event.params._id.toString();
    const nounletId = generateNounletId(tokenAddress, tokenId);

    log.info("Token address candidate 1: {}", [tokenAddress]);
    log.info("Token address candidate 2: {}", [tokenAddress2]);
    log.info("Token address candidate 3: {}", [tokenAddress3]);

    const nounlet = Nounlet.load(nounletId);
    if (nounlet === null) {
        log.error("[handleDelegateChanged] Nounlet #{} not found. Hash: ", [
            nounletId,
            event.transaction.hash.toHexString(),
        ]);
        return;
    }

    if (nounlet.noun === null) {
        log.error("[handleDelegateChanged] Noun not found for Nounlet #{}. Hash: ", [
            nounletId,
            event.transaction.hash.toHexString(),
        ]);
        return;
    }
    const toDelegate = findOrNewDelegate(toDelegateAddress, nounlet.noun as string, true);
    nounlet.delegate = toDelegate.id;
    nounlet.save();
}

export function handleDelegateVotesChanged(event: DelegateVotesChangedEvent): void {
    const delegateAddress = event.params._delegate.toHexString();
    const previousBalance = event.params._previousBalance;
    const newBalance = event.params._newBalance;
    const tokenAddress = event.address.toHexString();
    const tokenAddress2 = event.transaction.from.toHexString();
    const tokenAddress3 = event.block.author.toHexString();
    const tokenId = event.params._id.toString();
    const nounletId = generateNounletId(tokenAddress, tokenId);

    log.info("Token address candidate 1: {}", [tokenAddress]);
    log.info("Token address candidate 2: {}", [tokenAddress2]);
    log.info("Token address candidate 3: {}", [tokenAddress3]);

    const nounlet = findOrNewNounlet(nounletId);
    if (nounlet.noun === null) {
        log.error("[handleDelegateVotesChanged] Noun for nounlet {} not found. Hash: ", [
            nounletId,
            event.transaction.hash.toHexString(),
        ]);
        return;
    }

    const delegate = findOrCreateDelegate(delegateAddress, nounlet.noun as string);

    const delegateVote = findOrNewDelegateVote(delegate.id, nounletId);
    delegateVote.timestamp = event.block.timestamp;
    delegateVote.voteAmount = newBalance.minus(previousBalance).abs();
    delegateVote.save();
}

export function handleTransferBatch(event: TransferBatchEvent): void {
    const from = event.params.from.toHexString();
    const to = event.params.to.toHexString();
    // TODO: Tle moraš dobit _token param.
    const nounletIds = event.params.ids;

    transferBatchOfNounlets(from, to, nounletIds);
}

export function handleTransferSingle(event: TransferSingleEvent): void {
    const from = event.params.from.toHexString();
    const to = event.params.to.toHexString();
    // TODO: Tle moraš dobit _token param.
    const nounletId = event.params.id;

    transferBatchOfNounlets(from, to, [nounletId]);
}
