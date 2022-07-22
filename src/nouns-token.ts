import { log, store } from "@graphprotocol/graph-ts";
import { Transfer } from "../generated/NounsToken/NounsToken";
import { Auction, Delegate, Noun, Nounlet, Vault } from "../generated/schema";
import { findOrCreateNoun, findOrNewNoun } from "./utils/helpers";

// export function handleApproval(event: Approval): void {
// // Entities can be loaded from the store using a string ID; this ID
// // needs to be unique across all entities of the same type
// let entity = ExampleEntity.load(event.transaction.from.toHex())
//
// // Entities only exist after they have been saved to the store;
// // `null` checks allow to create entities on demand
// if (!entity) {
//   entity = new ExampleEntity(event.transaction.from.toHex())
//
//   // Entity fields can be set using simple assignments
//   entity.count = BigInt.fromI32(0)
// }
//
// // BigInt and BigDecimal math are supported
// entity.count = entity.count + BigInt.fromI32(1)
//
// // Entity fields can be set based on event parameters
// entity.owner = event.params.owner
// entity.approved = event.params.approved
//
// // Entities can be written to the store with `.save()`
// entity.save()
//
// Note: If a handler doesn't require existing field values, it is faster
// _not_ to load the entity from the store. Instead, create it fresh with
// `new Entity(...)`, set the fields that should be updated and save the
// entity back to the store. Fields that were not set or unset remain
// unchanged, allowing for partial updates to be applied.
// It is also possible to access smart contracts from mappings. For
// example, the contract that has emitted the event can be connected to
// with:
//
// let contract = Contract.bind(event.address)
//
// The following functions can then be called on this contract to access
// state variables and other data:
//
// - contract.DELEGATION_TYPEHASH(...)
// - contract.DOMAIN_TYPEHASH(...)
// - contract.balanceOf(...)
// - contract.checkpoints(...)
// - contract.contractURI(...)
// - contract.dataURI(...)
// - contract.decimals(...)
// - contract.delegates(...)
// - contract.descriptor(...)
// - contract.getApproved(...)
// - contract.getCurrentVotes(...)
// - contract.getPriorVotes(...)
// - contract.isApprovedForAll(...)
// - contract.isDescriptorLocked(...)
// - contract.isMinterLocked(...)
// - contract.isSeederLocked(...)
// - contract.mint(...)
// - contract.minter(...)
// - contract.name(...)
// - contract.nonces(...)
// - contract.noundersDAO(...)
// - contract.numCheckpoints(...)
// - contract.owner(...)
// - contract.ownerOf(...)
// - contract.proxyRegistry(...)
// - contract.seeder(...)
// - contract.seeds(...)
// - contract.supportsInterface(...)
// - contract.symbol(...)
// - contract.tokenByIndex(...)
// - contract.tokenOfOwnerByIndex(...)
// - contract.tokenURI(...)
// - contract.totalSupply(...)
// - contract.votesToDelegate(...)
// }

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
