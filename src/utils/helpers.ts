import { Account, Delegate, DelegateVote, Noun, Nounlet, Seed, Vault } from "../../generated/schema";
import { BigInt, log } from "@graphprotocol/graph-ts";

export const UNDEFINED_ID = "undefined";

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
        account.nounletBalance = BigInt.fromI32(0);
        account.nounletBalanceRaw = BigInt.fromI32(0);
        account.totalNounletsHeld = BigInt.fromI32(0);
        account.nounlets = [];
        if (persistNew) {
            account.save();
        }
    }
    return account;
}

export function findOrCreateDelegate(walletId: string, nounId: string): Delegate {
    return findOrNewDelegate(walletId, nounId, true);
}

export function findOrNewDelegate(walletId: string, nounId: string, persistNew: boolean = false): Delegate {
    const delegateId = walletId.concat("-").concat(nounId);
    let delegate = Delegate.load(delegateId);
    if (delegate === null) {
        delegate = new Delegate(delegateId);
        delegate.delegatedVotes = BigInt.fromI32(0);
        delegate.nounletsRepresentedAmount = BigInt.fromI32(0);
        delegate.nounletsRepresented = [];
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

export function findOrNewNounlet(nounletId: string, persistNew: boolean = false): Nounlet {
    let nounlet = Nounlet.load(nounletId);
    if (nounlet === null) {
        nounlet = new Nounlet(nounletId);
        nounlet.noun = UNDEFINED_ID;
        nounlet.delegateVotes = [];
        if (persistNew) {
            nounlet.save();
        }
    }
    return nounlet;
}

export function findOrNewSeed(seedId: string, persistNew: boolean = false): Seed {
    let seed = Seed.load(seedId);
    if (seed === null) {
        seed = new Seed(seedId);
        seed.head = BigInt.fromI32(0);
        seed.body = BigInt.fromI32(0);
        seed.accessory = BigInt.fromI32(0);
        seed.background = BigInt.fromI32(0);
        seed.glasses = BigInt.fromI32(0);
        if (persistNew) {
            seed.save();
        }
    }
    return seed;
}

export function findOrNewDelegateVote(delegateId: string, nounletId: string, persistNew: boolean = false): DelegateVote {
    const delegateVoteId = delegateId.concat("-").concat(nounletId);
    let delegateVote = DelegateVote.load(delegateVoteId);
    if (delegateVote === null) {
        delegateVote = new DelegateVote(delegateVoteId);
        delegateVote.nounlet = nounletId;
        delegateVote.delegate = delegateId;
        delegateVote.timestamp = BigInt.fromI32(0);
        if (persistNew) {
            delegateVote.save();
        }
    }
    return delegateVote;
}

let existingNounletsIds: BigInt[]; // Use WebAssembly global due to lack of closure support
export function transferBatchOfNounlets(fromAddress: string, toAddress: string, nounletIds: BigInt[]): void {
    existingNounletsIds = nounletIds.filter((nounletId) => Nounlet.load(nounletId.toString()) !== null);

    if (existingNounletsIds.length < nounletIds.length) {
        const nonExistingNounletIds = nounletIds.filter((nounletId) => !existingNounletsIds.includes(nounletId));
        log.error("Cannot transfer Nounlets {} as they are not in the store", [nonExistingNounletIds.toString()]);
        if (existingNounletsIds.length === 0) {
            return;
        }
    }

    const fromAccount = findOrNewAccount(fromAddress);
    const toAccount = findOrNewAccount(toAddress);

    const fromNounlets = fromAccount.nounlets;
    fromAccount.nounlets = fromNounlets.filter(
        (nounletId: string) => !existingNounletsIds.includes(BigInt.fromString(nounletId))
    );
    fromAccount.nounletBalance = BigInt.fromI32(fromAccount.nounlets.length);
    fromAccount.nounletBalanceRaw = BigInt.fromI32(fromAccount.nounlets.length);
    fromAccount.save();

    const toNounlets = toAccount.nounlets;
    toAccount.nounlets = toNounlets.concat(existingNounletsIds.map<string>((id: BigInt) => id.toString()));
    toAccount.totalNounletsHeld = fromAccount.totalNounletsHeld.plus(BigInt.fromI32(toAccount.nounlets.length));
    toAccount.nounletBalance = BigInt.fromI32(toAccount.nounlets.length);
    toAccount.nounletBalanceRaw = BigInt.fromI32(toAccount.nounlets.length);
    toAccount.save();
}
