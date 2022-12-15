import { describe, test, assert, clearStore, beforeEach, dataSourceMock } from "matchstick-as/assembly";
import { logStore } from "matchstick-as/assembly/store";
import { handleApproval, handleTransfer } from "../src/nouns-token";
import { Noun, Vault } from "../generated/schema";
import { generateApprovalEvent, generateTransferEvent } from "./mock-event-generator";
import { findOrCreateNoun, findOrCreateToken } from "../src/utils/helpers";
import {
    NOUNLETS_PROTOFORM_GOERLI_ADDRESS,
    NOUNLETS_PROTOFORM_MAINNET_ADDRESS,
    ZERO_ADDRESS,
} from "../src/utils/constants";

describe("Noun Token", () => {
    describe("Transfer Handler", () => {
        beforeEach(() => {
            clearStore();
        });

        test("Should dismiss a noun if 'to' address is not a fractional vault address", () => {
            // Given
            const tokenAddress = "0x5E32E16D1F3998B88b2d1b5c0455B92C5F0a9e09".toLowerCase();
            const token = findOrCreateToken(tokenAddress);
            const fractionalVaultId = "0x7f75136F3fBCc696941187d1077CDC581690E48d".toLowerCase();
            const fractionalVault = new Vault(fractionalVaultId);
            fractionalVault.token = token.id;
            fractionalVault.nounInVault = false;
            fractionalVault.save();
            const tokenId = 1;
            const event = generateTransferEvent(
                "0xeBC4054A73D336b620D8d41FF2107Ec124bF0EA6",
                "0xAC8b516F363Acaa542cC802b3BdC587fFdA6Ae40",
                tokenId.toString()
            );
            // When
            handleTransfer(event);
            // Then
            assert.fieldEquals("Vault", fractionalVault.id.toString(), "id", fractionalVault.id.toString());
            assert.fieldEquals("Vault", fractionalVault.id.toString(), "nounInVault", "false");
            assert.notInStore("Noun", tokenId.toString());
        });

        test("Should persist a noun if 'to' address is a fractional vault address", () => {
            // Given
            const tokenAddress = "0x5E32E16D1F3998B88b2d1b5c0455B92C5F0a9e09".toLowerCase();
            const token = findOrCreateToken(tokenAddress);
            const fractionalVaultId = "0x7f75136F3fBCc696941187d1077CDC581690E48d".toLowerCase();
            const fractionalVault = new Vault(fractionalVaultId);
            fractionalVault.token = token.id;
            fractionalVault.nounInVault = false;
            fractionalVault.save();
            const tokenId = 1;
            const event = generateTransferEvent(
                "0xeBC4054A73D336b620D8d41FF2107Ec124bF0EA6",
                fractionalVault.id,
                tokenId.toString()
            );
            // When
            handleTransfer(event);
            // Then
            assert.fieldEquals("Vault", fractionalVault.id.toString(), "id", fractionalVault.id.toString());
            assert.fieldEquals("Vault", fractionalVault.id.toString(), "nounInVault", "true");
            assert.fieldEquals("Noun", tokenId.toString(), "tributed", "false");
        });

        test("Should retrieve a noun if it is already in the store and if 'to' address is a fractional vault address", () => {
            // Given
            const tokenAddress = "0x3045CeAF286a8728a398a20cd872e01b0aC109E3".toLowerCase();
            const token = findOrCreateToken(tokenAddress);
            const fractionalVaultId = "0x7f75136F3fBCc696941187d1077CDC581690E48d".toLowerCase();
            const fractionalVault = new Vault(fractionalVaultId);
            fractionalVault.token = token.id;
            fractionalVault.nounInVault = true;
            fractionalVault.save();
            const tokenId = 1;
            const fractionalNoun = findOrCreateNoun(tokenId.toString());
            const event = generateTransferEvent(
                "0xeBC4054A73D336b620D8d41FF2107Ec124bF0EA6",
                fractionalVault.id,
                fractionalNoun.id
            );
            // When
            handleTransfer(event);

            // Then
            assert.fieldEquals("Vault", fractionalVault.id.toString(), "id", fractionalVault.id.toString());
            assert.fieldEquals("Noun", tokenId.toString(), "tributed", "false");
        });

        test("Should remove a noun if 'from' address is a fractional vault", () => {
            // Given
            const tokenAddress = "0xa6b5a3Be2990cd8c739577f755086701c52C1e8b".toLowerCase();
            const token = findOrCreateToken(tokenAddress);
            const noun = findOrCreateNoun("51");
            const fromAddress = "0xE377541c0B5D53708d90C879f44a124a57c2943A".toLowerCase();
            const fractionalVault = new Vault(fromAddress);
            fractionalVault.noun = noun.id;
            fractionalVault.token = token.id;
            fractionalVault.nounInVault = true;
            fractionalVault.save();
            const toAddress = "0x6d2F62f32b79AD7A548dF1b396040F180c678858".toLowerCase();

            // When
            handleTransfer(generateTransferEvent(fractionalVault.id, toAddress, noun.id));

            // Then
            assert.fieldEquals("Vault", fractionalVault.id, "nounInVault", "false");
        });

        test("Should not create a tributed Noun when approval for NounletProtoform on a different chain is set", () => {
            // Given
            const owner = "0xa6b5a3Be2990cd8c739577f755086701c52C1e8b".toLowerCase();
            const approvedContractAddress = NOUNLETS_PROTOFORM_MAINNET_ADDRESS.toLowerCase();
            const tokenId = 1;

            dataSourceMock.setNetwork("goerli");

            // When
            handleApproval(generateApprovalEvent(owner, approvedContractAddress, tokenId));

            // Then
            assert.notInStore("Noun", tokenId.toString());

            dataSourceMock.resetValues();
        });

        test("Should not create a tributed Noun when chain is unknown", () => {
            // Given
            const owner = "0xa6b5a3Be2990cd8c739577f755086701c52C1e8b".toLowerCase();
            const approvedContractAddress = NOUNLETS_PROTOFORM_GOERLI_ADDRESS.toLowerCase();
            const tokenId = 1;

            dataSourceMock.setNetwork("rinkeby");

            // When
            handleApproval(generateApprovalEvent(owner, approvedContractAddress, tokenId));

            // Then
            assert.notInStore("Noun", tokenId.toString());

            dataSourceMock.resetValues();
        });

        test("Should create a tributed Noun on Goerli on approval", () => {
            // Given
            const owner = "0xa6b5a3Be2990cd8c739577f755086701c52C1e8b".toLowerCase();
            const approvedContractAddress = NOUNLETS_PROTOFORM_GOERLI_ADDRESS.toLowerCase();
            const tokenId = 1;

            dataSourceMock.setNetwork("goerli");

            // When
            handleApproval(generateApprovalEvent(owner, approvedContractAddress, tokenId));

            // Then
            assert.fieldEquals("Noun", tokenId.toString(), "tributed", "true");

            dataSourceMock.resetValues();
        });

        test("Should create a tributed Noun on Mainnet on approval", () => {
            // Given
            const owner = "0xa6b5a3Be2990cd8c739577f755086701c52C1e8b".toLowerCase();
            const approvedContractAddress = NOUNLETS_PROTOFORM_MAINNET_ADDRESS.toLowerCase();
            const tokenId = 1;

            dataSourceMock.setNetwork("mainnet");

            // When
            handleApproval(generateApprovalEvent(owner, approvedContractAddress, tokenId));

            // Then
            assert.fieldEquals("Noun", tokenId.toString(), "tributed", "true");

            dataSourceMock.resetValues();
        });
    });
});
