import { VaultDeployed as VaultDeployedEvent } from "../generated/NounletRegistry/NounletRegistry";
import { findOrNewVault } from "./utils/helpers";
import { NounletToken } from "../generated/templates";

export function handleVaultDeployed(event: VaultDeployedEvent): void {
    const vault = findOrNewVault(event.params._vault.toHexString());
    vault.tokenAddress = event.params._token.toHexString();
    vault.save();
    NounletToken.create(event.params._token);
}
