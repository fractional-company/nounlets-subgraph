import {
    DelegateChanged as DelegateChangedEvent,
    DelegateVotesChanged as DelegateVotesChangedEvent,
    TransferBatch as TransferBatchEvent,
    TransferSingle as TransferSingleEvent,
} from "../generated/templates/NounletToken/NounletToken";
import {
    findOrCreateAccount,
    findOrCreateDelegate,
    findOrNewDelegate,
    findOrNewNounlet,
    generateDelegateVoteId,
} from "./utils/helpers";
import { Account, Delegate, DelegateVote, Noun, Nounlet } from "../generated/schema";
import { BigInt, log } from "@graphprotocol/graph-ts";

export function handleDelegateChanged(event: DelegateChangedEvent): void {
    log.debug("[handleDelegatesChanged] Address: {}, _delegator: {}, _fromDelegate: {}, _toDelegate: {}", [
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
    const fromDelegateNounletsCount = fromDelegate.nounletsRepresented.length;
    const toDelegateNounletsCount = toDelegate.nounletsRepresented.length;

    const holderNounlets = holder.nounletsHeld;
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
    fromDelegate.nounletsRepresentedCount = Math.max(fromDelegateNounletsCount - holderNounlets.length, 0) as i32;
    toDelegate.nounletsRepresentedCount = Math.max(
        toDelegateNounletsCount + holderNounlets.length,
        holderNounlets.length
    ) as i32;
    fromDelegate.save();
    toDelegate.save();
}

export function handleDelegateVotesChanged(event: DelegateVotesChangedEvent): void {
    log.debug("handleDelegateVotesChanged called. Address: {}, Delegate: {}, Previous Balance: {}, New Balance: {}", [
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
    log.debug("handleTransferBatch handler called. Address: {}, operator: {}, from: {}, to: {}, amounts: {}, ids: {}", [
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
    log.debug("handleTransferSingle handler called. Address: {}, operator: {}, from: {}, to: {}, amount: {}, id: {}", [
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
    let oldHolder = findOrCreateAccount(fromAddress, tokenAddress);
    const oldHolderNounletsCount = oldHolder.nounletsHeld.length;
    let newHolder = findOrCreateAccount(toAddress, tokenAddress);
    const newHolderNounletsCount = newHolder.nounletsHeld.length;
    let newDelegate = findOrCreateDelegate(toAddress, tokenAddress);
    const newDelegateNounletsCount = newDelegate.nounletsRepresented.length;

    const delegateCountMapper = new Map<string, number>();
    for (let i = 0; i < nounletIds.length; i++) {
        const nounlet = findOrNewNounlet(nounletIds[i].toString(), tokenAddress);
        if (nounlet.delegate !== null) {
            const currentDelegateWalletAddress = (nounlet.delegate as string).replace(tokenAddress, "").replace("-", "");
            const currentDelegate = findOrNewDelegate(currentDelegateWalletAddress, tokenAddress);

            const currentDelegateNounletsCount = delegateCountMapper.has(currentDelegate.id)
                ? delegateCountMapper.get(currentDelegate.id)
                : currentDelegate.nounletsRepresented.length;

            currentDelegate.nounletsRepresentedCount = Math.max(currentDelegateNounletsCount - 1, 0) as i32;
            currentDelegate.save();

            delegateCountMapper.set(currentDelegate.id, currentDelegate.nounletsRepresentedCount);
        }

        nounlet.delegate = newDelegate.id;
        nounlet.holder = newHolder.id;
        nounlet.save();
    }

    oldHolder = Account.load(oldHolder.id) as Account;
    newHolder = Account.load(newHolder.id) as Account;
    newDelegate = Delegate.load(newDelegate.id) as Delegate;
    oldHolder.nounletsHeldCount = Math.max(oldHolderNounletsCount - nounletIds.length, 0) as i32;
    newHolder.nounletsHeldCount = Math.max(newHolderNounletsCount + nounletIds.length, nounletIds.length) as i32;
    newDelegate.nounletsRepresentedCount = Math.max(
        newDelegateNounletsCount + nounletIds.length,
        nounletIds.length
    ) as i32;
    oldHolder.save();
    newHolder.save();
    newDelegate.save();
}

function moveNounlets(
    nounletIds: string[],
    tokenAddress: string,
    oldHolder: Account,
    newHolder: Account,
    oldDelegate: Delegate,
    newDelegate: Delegate
): void {
    for (let i = 0; i < nounletIds.length; i++) {
        const nounlet = findOrNewNounlet(nounletIds[i], tokenAddress);
        nounlet.delegate = newDelegate.id;
        nounlet.holder = newHolder.id;
        nounlet.save();
    }

    oldHolder = Account.load(oldHolder.id) as Account;
    newHolder = Account.load(newHolder.id) as Account;
    oldDelegate = Delegate.load(oldDelegate.id) as Delegate;
    newDelegate = Delegate.load(newDelegate.id) as Delegate;
    oldHolder.nounletsHeldCount = oldHolder.nounletsHeld.length;
    newHolder.nounletsHeldCount = newHolder.nounletsHeld.length;
    oldDelegate.nounletsRepresentedCount = oldDelegate.nounletsRepresented.length;
    newDelegate.nounletsRepresentedCount = newDelegate.nounletsRepresented.length;
    oldHolder.save();
    newHolder.save();
    oldDelegate.save();
    newDelegate.save();
}
