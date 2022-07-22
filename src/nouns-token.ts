import { store } from "@graphprotocol/graph-ts";
import { Transfer } from "../generated/NounsToken/NounsToken";
import { Noun, Vault } from "../generated/schema";
import { findOrCreateNoun } from "./utils/helpers";

export function handleTransfer(event: Transfer): void {
    const fromAddress = event.params.from.toHexString().toLowerCase();
    const toAddress = event.params.to.toHexString().toLowerCase();
    const nounId = event.params.tokenId.toString().toLowerCase();

    const nounVaultFrom = Vault.load(fromAddress);
    const nounVaultTo = Vault.load(toAddress);

    if (nounVaultFrom !== null) {
        // Noun was moved from Vault, so remove the noun from the store
        store.remove("Noun", nounId);
        nounVaultFrom.noun = null;
        nounVaultFrom.save();
    }

    if (nounVaultTo !== null) {
        // Noun was moved to the Vault, so save it to the store
        const noun = findOrCreateNoun(nounId);
        nounVaultTo.noun = noun.id;
        nounVaultTo.save();
    }
}
