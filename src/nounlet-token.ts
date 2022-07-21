import {
    DelegateChanged as DelegateChangedEvent,
    DelegateVotesChanged as DelegateVotesChangedEvent,
    TransferBatch as TransferBatchEvent,
    TransferSingle as TransferSingleEvent,
    URI as URIEvent,
} from "../generated/NounletToken/NounletToken";
import {
    findOrNewAccount,
    findOrNewDelegate,
    findOrNewNounlet,
    transferBatchOfNounlets,
    UNDEFINED_ID,
} from "./utils/helpers";
import { Nounlet } from "../generated/schema";
import { BigInt, log } from "@graphprotocol/graph-ts";

let accountNounlets: string[];
export function handleDelegateChanged(event: DelegateChangedEvent): void {
    const tokenHolderId = event.params._delegator.toHexString();
    const oldDelegateAddress = event.params._fromDelegate.toHexString();
    const newDelegateAddress = event.params._toDelegate.toHexString();
    const nounletId = event.params._id.toString();

    const nounlet = findOrNewNounlet(nounletId);
    if (nounlet.noun === UNDEFINED_ID) {
        log.error("[handleDelegateChanged] Noun for nounlet {} not found. Hash: ", [
            nounletId,
            event.transaction.hash.toHexString(),
        ]);
        return;
    }

    const tokenHolder = findOrNewAccount(tokenHolderId);
    accountNounlets = tokenHolder.nounlets;

    const oldDelegate = findOrNewDelegate(oldDelegateAddress, nounlet.noun);
    oldDelegate.nounletsRepresented = oldDelegate.nounletsRepresented.filter(
        (nounletId) => !accountNounlets.includes(nounletId)
    );
    oldDelegate.nounletsRepresentedAmount = BigInt.fromI32(oldDelegate.nounletsRepresented.length);

    const newDelegate = findOrNewDelegate(newDelegateAddress, nounlet.noun);
    newDelegate.nounletsRepresented = newDelegate.nounletsRepresented
        .concat(accountNounlets)
        .reduce((carry, nounlet) => {
            if (!carry.includes(nounlet)) {
                carry.push(nounlet);
            }
            return carry;
        }, [] as string[]);
    newDelegate.nounletsRepresentedAmount = BigInt.fromI32(newDelegate.nounletsRepresented.length);

    oldDelegate.save();
    newDelegate.save();
}

export function handleDelegateVotesChanged(event: DelegateVotesChangedEvent): void {
    const delegateAddress = event.params._delegate.toHexString();
    const newBalance = event.params._newBalance;
    const nounletId = event.params._id.toString();

    const nounlet = findOrNewNounlet(nounletId);
    if (nounlet.noun === UNDEFINED_ID) {
        log.error("[handleDelegateVotesChanged] Noun for nounlet {} not found. Hash: ", [
            nounletId,
            event.transaction.hash.toHexString(),
        ]);
        return;
    }

    const delegate = findOrNewDelegate(delegateAddress, nounlet.noun);
    delegate.delegatedVotes = newBalance;
    delegate.save();
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
