import {
    DelegateChanged as DelegateChangedEvent,
    DelegateVotesChanged as DelegateVotesChangedEvent,
    TransferBatch as TransferBatchEvent,
    TransferSingle as TransferSingleEvent,
} from "../generated/templates/NounletToken/NounletToken";
import {
    findOrCreateAccount,
    findOrCreateDelegate,
    findOrNewAccount,
    findOrNewDelegate,
    findOrNewDelegateVote,
    findOrNewNounlet,
    generateAccountId,
    generateDelegateId,
    generateDelegateVoteId,
    getDistinctValues,
    removeValueFromArray,
} from "./utils/helpers";
import { Account, Delegate, DelegateVote, Nounlet } from "../generated/schema";
import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { NounletToken } from "../generated/NounletToken/NounletToken";

export function handleDelegateChanged(event: DelegateChangedEvent): void {
    log.debug("[handleDelegateChanged] Address: {}, _delegator: {}, _fromDelegate: {}, _toDelegate: {}", [
        event.address.toHexString(),
        event.params._delegator.toHexString(),
        event.params._fromDelegate.toHexString(),
        event.params._toDelegate.toHexString(),
    ]);

    const tokenAddress = event.address.toHexString();
    const timestamp = event.block.timestamp;
    const holder = findOrCreateAccount(event.params._delegator.toHexString(), tokenAddress);
    const fromDelegate = findOrCreateDelegate(event.params._fromDelegate.toHexString(), tokenAddress);
    const toDelegate = findOrCreateDelegate(event.params._toDelegate.toHexString(), tokenAddress);

    let holderNounlets = holder.nounletsHeldIDs;
    let fromDelegateNounletIDs = fromDelegate.nounletsRepresentedIDs;
    let toDelegateNounletIDs = toDelegate.nounletsRepresentedIDs;

    for (let i = 0; i < holderNounlets.length; i++) {
        // Change Nounlet delegate
        const nounlet = Nounlet.load(holderNounlets[i]) as Nounlet;
        nounlet.delegate = toDelegate.id;
        nounlet.save();

        // Swap nounlet IDs
        fromDelegateNounletIDs = removeValueFromArray(fromDelegateNounletIDs, nounlet.id);
        toDelegateNounletIDs.push(nounlet.id);

        // Add delegate vote
        const delegateVote = new DelegateVote(generateDelegateVoteId(toDelegate.id, nounlet.id));
        delegateVote.delegator = holder.id;
        delegateVote.delegate = toDelegate.id;
        delegateVote.nounlet = nounlet.id;
        delegateVote.voteAmount = BigInt.fromI32(1);
        delegateVote.reason = "Delegate Changed";
        delegateVote.timestamp = timestamp;
        delegateVote.save();
    }

    // Update Account Delegate
    holder.delegate = toDelegate.id;
    holder.save();

    // Update nounlets represented IDs
    fromDelegate.nounletsRepresentedIDs = fromDelegateNounletIDs;
    toDelegate.nounletsRepresentedIDs = getDistinctValues(toDelegateNounletIDs);
    fromDelegate.save();
    toDelegate.save();
}

export function handleDelegateVotesChanged(event: DelegateVotesChangedEvent): void {
    log.debug("[handleDelegateVotesChanged] Address: {}, Delegate: {}, Previous Balance: {}, New Balance: {}", [
        event.address.toHexString(),
        event.params._delegate.toHexString(),
        event.params._previousBalance.toString(),
        event.params._newBalance.toString(),
    ]);

    // This event handler gets triggered on:
    //  - mint
    //  - batchMint
    //  - burn
    //  - batchBurn
    //  - transferFrom
    //  - batchTransferFrom
    //  - safeTransferFrom
    //  - batchSafeTransferFrom
    //  - delegate
}

export function handleTransferBatch(event: TransferBatchEvent): void {
    log.debug("[handleTransferBatch] Address: {}, operator: {}, from: {}, to: {}, amounts: {}, ids: {}", [
        event.address.toHexString(),
        event.params.operator.toHexString(),
        event.params.from.toHexString(),
        event.params.to.toHexString(),
        event.params.amounts.toString(),
        event.params.ids.toString(),
    ]);

    const tokenAddress = event.address.toHexString();
    const from = event.params.from.toHexString();
    const to = event.params.to.toHexString();
    const nounletIds = event.params.ids;

    transferBatchOfNounlets(tokenAddress, from, to, nounletIds, event.block.timestamp);
}

export function handleTransferSingle(event: TransferSingleEvent): void {
    log.debug("[handleTransferSingle] Address: {}, operator: {}, from: {}, to: {}, amount: {}, id: {}", [
        event.address.toHexString(),
        event.params.operator.toHexString(),
        event.params.from.toHexString(),
        event.params.to.toHexString(),
        event.params.amount.toString(),
        event.params.id.toString(),
    ]);

    const tokenAddress = event.address.toHexString();
    const from = event.params.from.toHexString();
    const to = event.params.to.toHexString();
    const nounletId = event.params.id;

    transferBatchOfNounlets(tokenAddress, from, to, [nounletId], event.block.timestamp);
}

function transferBatchOfNounlets(
    tokenAddress: string,
    fromAddress: string,
    toAddress: string,
    nounletIds: BigInt[],
    timestamp: BigInt
): void {
    const oldHolder = findOrNewAccount(fromAddress, tokenAddress);
    const newHolder = findOrNewAccount(toAddress, tokenAddress);

    // Try to fetch the current delegate from Blockchain
    let newDelegate: Delegate;
    // const contract = NounletToken.bind(Address.fromString(tokenAddress));
    // const delegateAddress = contract.try_delegates(Address.fromString(toAddress));
    // if (delegateAddress.reverted) { /** process the below delegation logic */ } else { newDelegate = findOrNewDelegate(delegateAddress.value.toHexString(), tokenAddress); }
    if (newHolder.delegate === null) {
        // Delegate is also a holder
        newDelegate = findOrNewDelegate(toAddress, tokenAddress);
    } else {
        // Holder already delegated their Nounlets, so this one also gets delegated to that same Delegate
        const delegateId = (newHolder.delegate as string).replace(tokenAddress, "").replace("-", "");
        newDelegate = findOrNewDelegate(delegateId, tokenAddress);
    }
    newHolder.delegate = newDelegate.id;

    let oldHolderNounletsHeldIDs = oldHolder.nounletsHeldIDs;
    let newHolderNounletsHeldIDs = newHolder.nounletsHeldIDs;
    let newDelegateNounletIDs = newDelegate.nounletsRepresentedIDs;

    for (let i = 0; i < nounletIds.length; i++) {
        const nounlet = findOrNewNounlet(nounletIds[i].toString(), tokenAddress);

        oldHolderNounletsHeldIDs = removeValueFromArray(oldHolderNounletsHeldIDs, nounlet.id);
        newHolderNounletsHeldIDs.push(nounlet.id);

        if (nounlet.delegate !== null) {
            const currentDelegateAddress = (nounlet.delegate as string).replace(tokenAddress, "").replace("-", "");
            let currentDelegate = findOrCreateDelegate(currentDelegateAddress, tokenAddress);
            let currentDelegateNounletIDs = currentDelegate.nounletsRepresentedIDs;
            currentDelegateNounletIDs = removeValueFromArray(currentDelegateNounletIDs, nounlet.id);
            currentDelegate.nounletsRepresentedIDs = currentDelegateNounletIDs;
            currentDelegate.save();
        }
        newDelegateNounletIDs.push(nounlet.id);

        nounlet.delegate = newDelegate.id;
        nounlet.delegate = newDelegate.id;
        nounlet.holder = newHolder.id;
        nounlet.save();

        // Save delegate vote
        const delegateVote = findOrNewDelegateVote(newDelegate.id, nounlet.id);
        delegateVote.delegator = newHolder.id;
        delegateVote.delegate = newDelegate.id;
        delegateVote.nounlet = nounlet.id;
        delegateVote.reason = "Nounlet Transferred";
        delegateVote.timestamp = timestamp;
        delegateVote.voteAmount = BigInt.fromI32(1);
        delegateVote.save();
    }

    oldHolder.nounletsHeldIDs = oldHolderNounletsHeldIDs;
    newHolder.nounletsHeldIDs = getDistinctValues(newHolderNounletsHeldIDs);
    newDelegate.nounletsRepresentedIDs = getDistinctValues(newDelegateNounletIDs);
    oldHolder.save();
    newHolder.save();
    newDelegate.save();
}
