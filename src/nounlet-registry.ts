import { VaultDeployed as VaultDeployedEvent } from "../generated/NounletRegistry/NounletRegistry";
import { findOrCreateVault } from "./utils/helpers";

export function handleVaultDeployed(event: VaultDeployedEvent): void {
    findOrCreateVault(event.params._vault.toHexString());
}
