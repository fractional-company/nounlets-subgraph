import { VaultDeployed as VaultDeployedEvent } from "../generated/NounletRegistry/NounletRegistry"
import { VaultDeployed } from "../generated/schema"

export function handleVaultDeployed(event: VaultDeployedEvent): void {
  let entity = new VaultDeployed(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._vault = event.params._vault
  entity._token = event.params._token
  entity.save()
}
