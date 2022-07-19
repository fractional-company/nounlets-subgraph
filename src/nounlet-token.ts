import {
    DelegateChanged as DelegateChangedEvent,
    DelegateVotesChanged as DelegateVotesChangedEvent,
    TransferBatch as TransferBatchEvent,
    TransferSingle as TransferSingleEvent,
    URI as URIEvent,
} from "../generated/NounletToken/NounletToken";
import { findOrNewAccount, findOrNewDelegate, transferBatchOfNounlets } from "./utils/helpers";

let accountNounlets: string[];
export function handleDelegateChanged(event: DelegateChangedEvent): void {
    const tokenHolderId = event.params._delegator.toHexString();
    const oldDelegateAddress = event.params._fromDelegate.toHexString();
    const newDelegateAddress = event.params._toDelegate.toHexString();
    // const nounId = event.params._id;

    const tokenHolder = findOrNewAccount(tokenHolderId);
    accountNounlets = tokenHolder.nounlets;

    const oldDelegate = findOrNewDelegate(oldDelegateAddress);
    oldDelegate.tokenHoldersRepresentedAmount =
        oldDelegate.tokenHoldersRepresentedAmount > 0 ? oldDelegate.tokenHoldersRepresentedAmount - 1 : 0;
    const oldNounletsRepresented = oldDelegate.nounletsRepresented;
    oldDelegate.nounletsRepresented = oldNounletsRepresented.filter((nounletId) => !accountNounlets.includes(nounletId));

    const newDelegate = findOrNewDelegate(newDelegateAddress);
    newDelegate.tokenHoldersRepresentedAmount = newDelegate.tokenHoldersRepresentedAmount + 1;
    newDelegate.nounletsRepresented = newDelegate.nounletsRepresented
        .concat(accountNounlets)
        .reduce((carry, nounlet) => {
            if (!carry.includes(nounlet)) {
                carry.push(nounlet);
            }
            return carry;
        }, [] as string[]);

    tokenHolder.delegate = newDelegate.id;

    oldDelegate.save();
    newDelegate.save();
    tokenHolder.save();
}

export function handleDelegateVotesChanged(event: DelegateVotesChangedEvent): void {
    const delegateAddress = event.params._delegate.toHexString();
    const newBalance = event.params._newBalance;

    const delegate = findOrNewDelegate(delegateAddress);
    delegate.delegatedVotes = newBalance;
    delegate.delegatedVotesRaw = newBalance;
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

export function handleURI(event: URIEvent): void {
    // let entity = new URI(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
    // entity.value = event.params.value;
    // entity.id = event.params.id;
    // entity.save();
}
