import { Account, Delegate, DelegateVote, Noun, Nounlet, Vault } from "../../generated/schema";
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
        account.totalNounletsHeld = BigInt.fromI32(0);
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
    const delegateId = generateDelegateId(walletId, nounId);
    let delegate = Delegate.load(delegateId);
    if (delegate === null) {
        delegate = new Delegate(delegateId);
        // delegate.nounletsRepresented = [];
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

export function transferBatchOfNounlets(fromAddress: string, toAddress: string, nounletIds: BigInt[]): void {
    const fromAccount = findOrCreateAccount(fromAddress);
    let toAccount = findOrCreateAccount(toAddress);
    let nounletsTransferedCount = 0;

    for (let i = 0; i < nounletIds.length; i++) {
        const nounletId = nounletIds[i].toString();
        const nounlet = Nounlet.load(nounletId);

        if (nounlet !== null) {
            // Remove the delegate for each nounlet that's being transferred.
            nounlet.delegate = null;
            nounlet.holder = toAccount.id;
            nounlet.save();
            nounletsTransferedCount++;
        } else {
            log.error("[transferBatchOfNounlets] Cannot transfer Nounlet #{} as it does not exist in the store", [
                nounletId,
            ]);
        }
    }

    toAccount.totalNounletsHeld = toAccount.totalNounletsHeld.plus(BigInt.fromI32(nounletsTransferedCount));
    toAccount.save();
}

export function generateDelegateId(walletId: string, nounId: string): string {
    return walletId.concat("-").concat(nounId);
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
