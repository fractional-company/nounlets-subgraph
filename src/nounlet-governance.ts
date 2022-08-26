import { ClaimDelegate as ClaimDelegateEvent } from "../generated/NounletGovernance/NounletGovernance";
import { log } from "@graphprotocol/graph-ts";
import { Vault } from "../generated/schema";
import { findOrNewNoun } from "./utils/helpers";

export function handleClaimDelegate(event: ClaimDelegateEvent): void {
    log.debug("[handleClaimDelegate] _token: {}, _previousDelegate: {}, _newDelegate: {}", [
        event.params._vault.toHexString(),
        event.params._previousDelegate.toHexString(),
        event.params._newDelegate.toHexString(),
    ]);

    const vaultAddress = event.params._vault.toHexString();
    const newDelegateAddress = event.params._newDelegate.toHexString();

    const vault = Vault.load(vaultAddress);
    if (vault === null) {
        log.error("[handleClaimDelegate] Vault not found: {}", [vaultAddress]);
        return;
    }
    const nounId = vault.noun;
    if (nounId === null) {
        log.error("[handleClaimDelegate] Vault {} does not contain a Noun", [vaultAddress]);
        return;
    }

    const noun = findOrNewNoun(nounId);
    noun.currentDelegate = newDelegateAddress;
    noun.save();
}
