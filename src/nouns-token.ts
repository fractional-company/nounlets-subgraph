import { log, dataSource, json, JSONValue } from "@graphprotocol/graph-ts";
import { Approval, Transfer } from "../generated/NounsToken/NounsToken";
import { Vault } from "../generated/schema";
import { findOrCreateNoun } from "./utils/helpers";
import { NOUNLETS_PROTOFORM_GOERLI_ADDRESS, NOUNLETS_PROTOFORM_MAINNET_ADDRESS } from "./utils/constants";

export function handleApproval(event: Approval): void {
    log.debug("[handleApproval] owner: {}, approved: {}, tokenId: {}", [
        event.params.owner.toHexString(),
        event.params.approved.toHexString(),
        event.params.tokenId.toString(),
    ]);

    const approvedContractAddress = event.params.approved.toHexString().toLowerCase();
    const nounId = event.params.tokenId.toString();
    const chain = dataSource.network().toLowerCase();

    let nounletProtoformAddress = "";
    if (chain == "mainnet") {
        nounletProtoformAddress = NOUNLETS_PROTOFORM_MAINNET_ADDRESS.toLowerCase();
    }
    if (chain == "goerli") {
        nounletProtoformAddress = NOUNLETS_PROTOFORM_GOERLI_ADDRESS.toLowerCase();
    }

    if (approvedContractAddress == nounletProtoformAddress) {
        findOrCreateNoun(nounId);
    }
}

export function handleTransfer(event: Transfer): void {
    log.debug("[handleTransfer] from: {}, to: {}, tokenId: {}", [
        event.params.from.toHexString(),
        event.params.to.toHexString(),
        event.params.tokenId.toString(),
    ]);

    const fromAddress = event.params.from.toHexString().toLowerCase();
    const toAddress = event.params.to.toHexString().toLowerCase();
    const nounId = event.params.tokenId.toString().toLowerCase();

    const nounVaultFrom = Vault.load(fromAddress);
    const nounVaultTo = Vault.load(toAddress);

    if (nounVaultFrom !== null) {
        // Noun was moved from Vault, so mark the Vault as "nounless"
        nounVaultFrom.nounInVault = false;
        nounVaultFrom.save();
    }

    if (nounVaultTo !== null) {
        // Noun was moved to the Vault, so save it to the store
        const noun = findOrCreateNoun(nounId);
        nounVaultTo.noun = noun.id;
        nounVaultTo.nounInVault = true;
        nounVaultTo.save();
    }
}
