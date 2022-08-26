import {
    DelegateChanged as DelegateChangedEvent,
    DelegateVotesChanged as DelegateVotesChangedEvent,
    TransferBatch as TransferBatchEvent,
    TransferSingle as TransferSingleEvent,
} from "../generated/templates/NounletToken/NounletToken";
import {
    createAccount,
    createDelegate,
    findOrCreateAccount,
    findOrCreateDelegate,
    findOrNewAccount,
    findOrNewDelegate,
    findOrNewNounlet,
    generateAccountId,
    generateDelegateId,
    generateDelegateVoteId,
} from "./utils/helpers";
import { Account, Delegate, DelegateVote, Noun, Nounlet } from "../generated/schema";
import { BigInt, log } from "@graphprotocol/graph-ts";

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

    const holderNounlets = holder.nounletsHeld || [];
    for (let i = 0; i < holderNounlets.length; i++) {
        // Change Nounlet delegate
        const nounlet = Nounlet.load(holderNounlets[i]) as Nounlet;
        nounlet.delegate = toDelegate.id;

        // Add delegate vote
        const delegateVote = new DelegateVote(generateDelegateVoteId(toDelegate.id, nounlet.id));
        delegateVote.delegate = toDelegate.id;
        delegateVote.nounlet = nounlet.id;
        delegateVote.voteAmount = BigInt.fromI32(1);
        delegateVote.reason = "Delegate Changed";
        delegateVote.timestamp = timestamp;

        nounlet.save();
        delegateVote.save();
    }

    // Update nounlets represented count
    fromDelegate.nounletsRepresentedCount = Math.max(
        fromDelegate.nounletsRepresentedCount - holderNounlets.length,
        0
    ) as i32;
    toDelegate.nounletsRepresentedCount = Math.max(
        toDelegate.nounletsRepresentedCount + holderNounlets.length,
        holderNounlets.length
    ) as i32;
    fromDelegate.save();
    toDelegate.save();
}

export function handleDelegateVotesChanged(event: DelegateVotesChangedEvent): void {
    log.debug("[handleDelegateVotesChanged] Address: {}, Delegate: {}, Previous Balance: {}, New Balance: {}", [
        event.address.toHexString(),
        event.params._delegate.toString(),
        event.params._previousBalance.toHexString(),
        event.params._newBalance.toHexString(),
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

    transferBatchOfNounlets(tokenAddress, from, to, nounletIds);
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

    transferBatchOfNounlets(tokenAddress, from, to, [nounletId]);
}

function transferBatchOfNounlets(
    tokenAddress: string,
    fromAddress: string,
    toAddress: string,
    nounletIds: BigInt[]
): void {
    const oldHolder = findOrNewAccount(fromAddress, tokenAddress);
    const newHolder = findOrNewAccount(toAddress, tokenAddress);
    const newDelegate = findOrNewDelegate(toAddress, tokenAddress);

    // const delegateCountMapper = new Map<string, number>();
    for (let i = 0; i < nounletIds.length; i++) {
        const nounlet = findOrNewNounlet(nounletIds[i].toString(), tokenAddress);
        if (nounlet.delegate !== null) {
            const currentDelegateAddress = (nounlet.delegate as string).replace(tokenAddress, "").replace("-", "");
            let currentDelegate = findOrCreateDelegate(currentDelegateAddress, tokenAddress);
            currentDelegate.nounletsRepresentedCount = Math.max(currentDelegate.nounletsRepresentedCount - 1, 0) as i32;
            currentDelegate.save();

            // delegateCountMapper.set(currentDelegate.id, currentDelegate.nounletsRepresentedCount);
        }

        nounlet.delegate = newDelegate.id;
        nounlet.holder = newHolder.id;
        nounlet.save();
    }

    oldHolder.nounletsHeldCount = Math.max(oldHolder.nounletsHeldCount - nounletIds.length, 0) as i32;
    newHolder.nounletsHeldCount = Math.max(newHolder.nounletsHeldCount + nounletIds.length, nounletIds.length) as i32;
    newDelegate.nounletsRepresentedCount = Math.max(
        newDelegate.nounletsRepresentedCount + nounletIds.length,
        nounletIds.length
    ) as i32;
    oldHolder.save();
    newHolder.save();
    newDelegate.save();
}
