import { Account, Noun, Nounlet } from "../../generated/schema";
import { BigInt, log } from "@graphprotocol/graph-ts";

export function findOrCreateNoun(nounId: string): Noun {
    let noun = Noun.load(nounId);
    if (noun === null) {
        noun = new Noun(nounId);
        noun.save();
    }
    return noun;
}

export function findOrCreateAccount(accountId: string, nounlets: string[] = []): Account {
    let account = Account.load(accountId);
    if (account === null) {
        account = new Account(accountId);
        account.nounlets = [];
        account.save();
    }
    return account;
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

    const fromAccount = findOrCreateAccount(fromAddress);
    const toAccount = findOrCreateAccount(toAddress);

    const fromNounlets = fromAccount.nounlets || [];
    fromAccount.nounlets = fromNounlets.filter(
        (nounletId: string) => !existingNounletsIds.includes(BigInt.fromString(nounletId))
    );
    fromAccount.save();

    const toNounlets = toAccount.nounlets || [];
    toAccount.nounlets = toNounlets.concat(existingNounletsIds.map<string>((id: BigInt) => id.toString()));
    toAccount.save();
}
