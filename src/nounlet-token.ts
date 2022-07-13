import {
    ContractApprovalForAll as ContractApprovalForAllEvent,
    ContractDelegateChanged as ContractDelegateChangedEvent,
    ContractDelegateVotesChanged as ContractDelegateVotesChangedEvent,
    SetRoyalty as SetRoyaltyEvent,
    SingleApproval as SingleApprovalEvent,
    TransferBatch as TransferBatchEvent,
    TransferSingle as TransferSingleEvent,
    URI as URIEvent,
} from "../generated/NounletToken/NounletToken";
import {
    Account,
    ContractApprovalForAll,
    ContractDelegateChanged,
    ContractDelegateVotesChanged,
    Nounlet,
    SetRoyalty,
    SingleApproval,
    TransferBatch,
    TransferSingle,
    URI,
} from "../generated/schema";
import { log } from "@graphprotocol/graph-ts";

export function handleContractApprovalForAll(event: ContractApprovalForAllEvent): void {
    let entity = new ContractApprovalForAll(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
    entity.owner = event.params.owner;
    entity.operator = event.params.operator;
    entity.approved = event.params.approved;
    entity.save();
}

export function handleContractDelegateChanged(event: ContractDelegateChangedEvent): void {
    let entity = new ContractDelegateChanged(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
    entity._delegator = event.params._delegator;
    entity._id = event.params._id;
    entity._fromDelegate = event.params._fromDelegate;
    entity._toDelegate = event.params._toDelegate;
    entity.save();
}

export function handleContractDelegateVotesChanged(event: ContractDelegateVotesChangedEvent): void {
    let entity = new ContractDelegateVotesChanged(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
    entity._delegate = event.params._delegate;
    entity._id = event.params._id;
    entity._previousBalance = event.params._previousBalance;
    entity._newBalance = event.params._newBalance;
    entity.save();
}

export function handleSetRoyalty(event: SetRoyaltyEvent): void {
    let entity = new SetRoyalty(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
    entity._receiver = event.params._receiver;
    entity._id = event.params._id;
    entity._percentage = event.params._percentage;
    entity.save();
}

export function handleSingleApproval(event: SingleApprovalEvent): void {
    let entity = new SingleApproval(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
    entity._owner = event.params._owner;
    entity._operator = event.params._operator;
    entity._id = event.params._id;
    entity._approved = event.params._approved;
    entity.save();
}

export function handleTransferBatch(event: TransferBatchEvent): void {
    let entity = new TransferBatch(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
    entity.operator = event.params.operator;
    entity.from = event.params.from;
    entity.to = event.params.to;
    entity.ids = event.params.ids;
    entity.amounts = event.params.amounts;
    entity.save();
}

let nounletId: string;
export function handleTransferSingle(event: TransferSingleEvent): void {
    const from = event.params.from.toHexString();
    const to = event.params.to.toHexString();
    nounletId = event.params.id.toString();

    const nounlet = Nounlet.load(nounletId);
    if (nounlet === null) {
        log.error("Cannot transfer Nounlet {} as it's not in the store", [nounletId]);
        return;
    }
    const fromAccount = Account.load(from);
    const toAccount = Account.load(to);
    if (fromAccount !== null) {
        let previousNounlets = fromAccount.nounlets || [];
        log.info("Nounlet ID: {}, Nounlets: {}", [nounletId, previousNounlets.toString()]);
        fromAccount.nounlets = previousNounlets.filter((id: string) => id != nounletId);
        log.info("Nounlets rest: {}", [fromAccount.nounlets.toString()]);
        fromAccount.save();
    }
    if (toAccount !== null) {
        toAccount.nounlets.push(nounletId);
        toAccount.save();
    }

    // let entity = new TransferSingle(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
    // entity.operator = event.params.operator;
    // entity.from = event.params.from;
    // entity.to = event.params.to;
    // entity.id = event.params.id;
    // entity.amount = event.params.amount;
    // entity.save();
}

export function handleURI(event: URIEvent): void {
    let entity = new URI(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
    entity.value = event.params.value;
    entity.id = event.params.id;
    entity.save();
}
