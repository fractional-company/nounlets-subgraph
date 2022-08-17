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
    transferBatchOfNounlets,
} from "./utils/helpers";
import { Nounlet } from "../generated/schema";
import { log } from "@graphprotocol/graph-ts";

let nounletId: string;
export function handleDelegateChanged(event: DelegateChangedEvent): void {
    const fromDelegateAddress = event.params._fromDelegate.toHexString();
    const toDelegateAddress = event.params._toDelegate.toHexString();
    nounletId = event.params._id.toString();

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
    const nounletId = event.params._id.toString();

    const nounlet = findOrNewNounlet(nounletId);
    if (nounlet.noun === null) {
        log.error("[handleDelegateVotesChanged] Noun for nounlet {} not found. Hash: ", [
            nounletId,
            event.transaction.hash.toHexString(),
        ]);
        return;
    }

    const delegate = findOrCreateDelegate(delegateAddress, nounlet.noun as string);
    // delegate.delegatedVotes = newBalance;
    // delegate.save();

    const delegateVote = findOrNewDelegateVote(delegate.id, nounletId);
    delegateVote.timestamp = event.block.timestamp;
    delegateVote.voteAmount = newBalance.minus(previousBalance).abs();
    delegateVote.save();
}

export function handleTransferBatch(event: TransferBatchEvent): void {
    const from = event.params.from.toHexString();
    const to = event.params.to.toHexString();
    const nounletIds = event.params.ids;

    transferBatchOfNounlets(from, to, nounletIds);
}

export function handleTransferSingle(event: TransferSingleEvent): void {
    const from = event.params.from.toHexString();
    const to = event.params.to.toHexString();
    const nounletId = event.params.id;

    transferBatchOfNounlets(from, to, [nounletId]);
}
