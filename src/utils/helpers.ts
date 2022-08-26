import { Account, Delegate, DelegateVote, Noun, Nounlet, Vault } from "../../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts";

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

export function findOrCreateAccount(walletId: string, tokenAddress: string): Account {
    return findOrNewAccount(walletId, tokenAddress, true);
}

export function findOrNewAccount(walletId: string, tokenAddress: string, persistNew: boolean = false): Account {
    const accountId = generateAccountId(walletId, tokenAddress);
    let account = Account.load(accountId);
    if (account === null) {
        account = new Account(accountId);
        account.nounletsHeldCount = 0;
        account.nounletsHeld = [];
        if (persistNew) {
            account.save();
        }
    }
    return account;
}

export function findOrCreateDelegate(walletId: string, tokenAddress: string): Delegate {
    return findOrNewDelegate(walletId, tokenAddress, true);
}

export function findOrNewDelegate(walletId: string, tokenAddress: string, persistNew: boolean = false): Delegate {
    const delegateId = generateDelegateId(walletId, tokenAddress);
    let delegate = Delegate.load(delegateId);
    if (delegate === null) {
        delegate = new Delegate(delegateId);
        delegate.nounletsRepresentedCount = 0;
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

export function findOrNewNounlet(tokenId: string, tokenAddress: string, persistNew: boolean = false): Nounlet {
    const nounletId = generateNounletId(tokenAddress, tokenId);
    let nounlet = Nounlet.load(nounletId);
    if (nounlet === null) {
        nounlet = new Nounlet(nounletId);
        nounlet.delegateVotes = [];
        if (persistNew) {
            nounlet.save();
        }
    }
    return nounlet;
}

export function findOrNewDelegateVote(delegateId: string, nounletId: string, persistNew: boolean = false): DelegateVote {
    const delegateVoteId = generateDelegateVoteId(delegateId, nounletId);
    let delegateVote = DelegateVote.load(delegateVoteId);
    if (delegateVote === null) {
        delegateVote = new DelegateVote(delegateVoteId);
        delegateVote.nounlet = nounletId;
        delegateVote.delegate = delegateId;
        delegateVote.voteAmount = BigInt.fromI32(0);
        delegateVote.timestamp = BigInt.fromI32(0);
        if (persistNew) {
            delegateVote.save();
        }
    }
    return delegateVote;
}

export function generateAccountId(walletId: string, tokenAddress: string): string {
    return tokenAddress.concat("-").concat(walletId);
}

export function generateDelegateVoteId(delegateId: string, nounletId: string): string {
    return delegateId.concat("-").concat(nounletId);
}

export function generateNounletId(tokenAddress: string, tokenId: string): string {
    return tokenAddress.concat("-").concat(tokenId);
}

export function generateAuctionId(tokenAddress: string, tokenId: string): string {
    return generateNounletId(tokenAddress, tokenId);
}

export function generateDelegateId(walletId: string, tokenAddress: string): string {
    return generateAccountId(walletId, tokenAddress);
}
