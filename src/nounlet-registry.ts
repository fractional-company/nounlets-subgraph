import { VaultDeployed as VaultDeployedEvent } from "../generated/NounletRegistry/NounletRegistry";
import { findOrNewVault } from "./utils/helpers";
import { NounletToken } from "../generated/templates";
import { log } from "@graphprotocol/graph-ts";

export function handleVaultDeployed(event: VaultDeployedEvent): void {
    log.debug("[handleVaultDeployed] _vault: {}, _token: {}", [
        event.params._vault.toHexString(),
        event.params._token.toHexString(),
    ]);

    const vault = findOrNewVault(event.params._vault.toHexString());
    vault.tokenAddress = event.params._token.toHexString();
    vault.save();
    NounletToken.create(event.params._token);
}
