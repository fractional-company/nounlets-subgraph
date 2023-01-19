import { log, dataSource } from "@graphprotocol/graph-ts";
import { Approval, Transfer } from "../generated/NounsToken/NounsToken";
import { Vault } from "../generated/schema";
import { findOrNewNoun } from "./utils/helpers";
import {
    NOUNLETS_PROTOFORM_GOERLI_ADDRESS,
    NOUNLETS_PROTOFORM_GOERLI_ADDRESS_V1,
    NOUNLETS_PROTOFORM_MAINNET_ADDRESS,
    NOUNLETS_PROTOFORM_MAINNET_ADDRESS_V1,
    ZERO_ADDRESS,
} from "./utils/constants";

export function handleApproval(event: Approval): void {
    // TODO: How does the disapproval work if we do not have a boolean?
    log.debug("[handleApproval] owner: {}, approved: {}, tokenId: {}", [
        event.params.owner.toHexString(),
        event.params.approved.toHexString(),
        event.params.tokenId.toString(),
    ]);

    const tributorAddress = event.params.owner.toHexString();
    const approvedContractAddress = event.params.approved.toHexString().toLowerCase();
    const nounId = event.params.tokenId.toString();
    const chain = dataSource.network().toLowerCase();

    let validProtoformAddresses: string[] = [];
    if (chain == "mainnet") {
        validProtoformAddresses.push(NOUNLETS_PROTOFORM_MAINNET_ADDRESS.toLowerCase());
        validProtoformAddresses.push(NOUNLETS_PROTOFORM_MAINNET_ADDRESS_V1.toLowerCase());
    } else if (chain == "goerli") {
        validProtoformAddresses.push(NOUNLETS_PROTOFORM_GOERLI_ADDRESS_V1.toLowerCase());
        validProtoformAddresses.push(NOUNLETS_PROTOFORM_GOERLI_ADDRESS.toLowerCase());
    }

    if (validProtoformAddresses.includes(approvedContractAddress)) {
        // Noun has been approved for transfer
        const noun = findOrNewNoun(nounId);
        noun.tributedBy = tributorAddress;
        noun.save();
    }

    if (approvedContractAddress == ZERO_ADDRESS) {
        // Noun has been disapproved for transfer
        const noun = findOrNewNoun(nounId);
        noun.tributedBy = ZERO_ADDRESS;
        noun.save();
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
        const noun = findOrNewNoun(nounId);
        noun.tributedBy = ZERO_ADDRESS;
        noun.save();
        nounVaultTo.noun = noun.id;
        nounVaultTo.nounInVault = true;
        nounVaultTo.save();
    }
}
