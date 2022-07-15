import { VaultDeployed as VaultDeployedEvent } from "../generated/NounletRegistry/NounletRegistry";
import { Vault } from "../generated/schema";

export function handleVaultDeployed(event: VaultDeployedEvent): void {
    const vaultId = event.params._vault.toHexString();
    const vault = new Vault(vaultId);
    vault.save();
}
