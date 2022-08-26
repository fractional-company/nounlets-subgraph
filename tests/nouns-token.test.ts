import { describe, test, assert, clearStore, beforeEach } from "matchstick-as/assembly";
import { handleTransfer } from "../src/nouns-token";
import { Noun, Vault } from "../generated/schema";
import { generateTransferEvent } from "./mock-event-generator";
import { findOrCreateNoun } from "../src/utils/helpers";

describe("Noun Token", () => {
    describe("Transfer Handler", () => {
        beforeEach(() => {
            clearStore();
        });

        test("Should dismiss a noun if 'to' address is not a fractional vault address", () => {
            // Given
            const fractionalVaultId = "0x7f75136F3fBCc696941187d1077CDC581690E48d".toLowerCase();
            const fractionalVault = new Vault(fractionalVaultId);
            fractionalVault.tokenAddress = "0x5E32E16D1F3998B88b2d1b5c0455B92C5F0a9e09".toLowerCase();
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
            assert.notInStore("Noun", tokenId.toString());
        });

        test("Should persist a noun if 'to' address is a fractional vault address", () => {
            // Given
            const fractionalVaultId = "0x7f75136F3fBCc696941187d1077CDC581690E48d".toLowerCase();
            const fractionalVault = new Vault(fractionalVaultId);
            fractionalVault.tokenAddress = "0x5E32E16D1F3998B88b2d1b5c0455B92C5F0a9e09".toLowerCase();
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
            assert.fieldEquals("Noun", tokenId.toString(), "id", tokenId.toString());
        });

        test("Should retrieve a noun if it is already in the store and if 'to' address is a fractional vault address", () => {
            // Given
            const fractionalVaultId = "0x7f75136F3fBCc696941187d1077CDC581690E48d".toLowerCase();
            const fractionalVault = new Vault(fractionalVaultId);
            fractionalVault.tokenAddress = "0x3045CeAF286a8728a398a20cd872e01b0aC109E3".toLowerCase();
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
            assert.fieldEquals("Noun", tokenId.toString(), "id", tokenId.toString());
        });

        test("Should remove a noun if 'from' address is a fractional vault", () => {
            // Given
            const noun = findOrCreateNoun("51");
            const fromAddress = "0xE377541c0B5D53708d90C879f44a124a57c2943A".toLowerCase();
            const fractionalVault = new Vault(fromAddress);
            fractionalVault.noun = noun.id;
            fractionalVault.tokenAddress = "0xa6b5a3Be2990cd8c739577f755086701c52C1e8b".toLowerCase();
            fractionalVault.save();
            const toAddress = "0x6d2F62f32b79AD7A548dF1b396040F180c678858".toLowerCase();

            // When
            handleTransfer(generateTransferEvent(fractionalVault.id, toAddress, noun.id));

            // Then
            assert.fieldEquals("Vault", fractionalVault.id, "noun", "null");
            assert.notInStore("Noun", noun.id);
        });
    });
});
