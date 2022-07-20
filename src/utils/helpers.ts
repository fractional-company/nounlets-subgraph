import { Account, Delegate, Noun, Nounlet, Vault } from "../../generated/schema";
import { BigInt, log } from "@graphprotocol/graph-ts";

export function findOrCreateNoun(nounId: string): Noun {
    return findOrNewNoun(nounId, true);
}

export function findOrNewNoun(nounId: string, persistNew: boolean = false): Noun {
    let noun = Noun.load(nounId);
    if (noun === null) {
        noun = new Noun(nounId);
        if (persistNew) {
            noun.save();
        }
    }
    return noun;
}

export function findOrCreateAccount(accountId: string): Account {
    return findOrNewAccount(accountId, true);
}

export function findOrNewAccount(accountId: string, persistNew: boolean = false): Account {
    let account = Account.load(accountId);
    if (account === null) {
        account = new Account(accountId);
        account.tokenBalance = BigInt.fromI32(0);
        account.tokenBalanceRaw = BigInt.fromI32(0);
        account.totalTokensHeld = BigInt.fromI32(0);
        account.totalTokensHeldRaw = BigInt.fromI32(0);
        account.nounlets = [];
        if (persistNew) {
            account.save();
        }
    }
    return account;
}

export function findOrCreateDelegate(delegateId: string): Delegate {
    return findOrNewDelegate(delegateId, true);
}

export function findOrNewDelegate(delegateId: string, persistNew: boolean = false): Delegate {
    let delegate = Delegate.load(delegateId);
    if (delegate === null) {
        delegate = new Delegate(delegateId);
        delegate.delegatedVotes = BigInt.fromI32(0);
        delegate.delegatedVotesRaw = BigInt.fromI32(0);
        delegate.delegatedVotes = BigInt.fromI32(0);
        delegate.nounletsRepresented = [];
        delegate.tokenHoldersRepresentedAmount = 0;
        if (persistNew) {
            delegate.save();
        }
    }
    return delegate;
}

export function findOrCreateVault(vaultId: string): Vault {
    return findOrNewVault(vaultId, true);
}

export function findOrNewVault(vaultId: string, persistNew: boolean = false): Vault {
    let vault = Vault.load(vaultId);
    if (vault === null) {
        vault = new Vault(vaultId);
        if (persistNew) {
            vault.save();
        }
    }
    return vault;
}

let existingNounletsIds: BigInt[]; // Use WebAssembly global due to lack of closure support
let nonExistingNounletIds: BigInt[]; // Use WebAssembly global due to lack of closure support
export function transferBatchOfNounlets(fromAddress: string, toAddress: string, nounletIds: BigInt[]): void {
    existingNounletsIds = nounletIds.filter((nounletId) => Nounlet.load(nounletId.toString()) !== null);
    nonExistingNounletIds = nounletIds.filter((nounletId) => !existingNounletsIds.includes(nounletId));

    if (nonExistingNounletIds.length > 0) {
        log.error("Cannot transfer Nounlets {} as they are not in the store", [nonExistingNounletIds.toString()]);
    }
    if (existingNounletsIds.length === 0) {
        return;
    }

    const fromAccount = findOrNewAccount(fromAddress);
    const toAccount = findOrNewAccount(toAddress);

    const fromNounlets = fromAccount.nounlets || [];
    fromAccount.nounlets = fromNounlets.filter(
        (nounletId: string) => !existingNounletsIds.includes(BigInt.fromString(nounletId))
    );
    fromAccount.save();

    const toNounlets = toAccount.nounlets || [];
    toAccount.nounlets = toNounlets.concat(existingNounletsIds.map<string>((id: BigInt) => id.toString()));
    toAccount.save();
}
