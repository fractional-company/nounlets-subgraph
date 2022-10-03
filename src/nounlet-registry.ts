import { VaultDeployed as VaultDeployedEvent } from "../generated/NounletRegistry/NounletRegistry";
import { findOrCreateToken, findOrNewVault } from "./utils/helpers";
import { NounletToken } from "../generated/templates";
import { log } from "@graphprotocol/graph-ts";

export function handleVaultDeployed(event: VaultDeployedEvent): void {
    log.debug("[handleVaultDeployed] _vault: {}, _token: {}", [
        event.params._vault.toHexString(),
        event.params._token.toHexString(),
    ]);

    const tokenAddress = event.params._token;

    const token = findOrCreateToken(tokenAddress.toHexString());
    const vault = findOrNewVault(event.params._vault.toHexString());
    vault.token = token.id;
    vault.nounInVault = false;
    vault.save();
    NounletToken.create(tokenAddress);
}
