import { describe, test, assert, afterEach, clearStore, beforeEach } from "matchstick-as/assembly";
import { handleTransfer } from "../src/nouns-token";
import { Auction, Bid, Noun, Nounlet, Vault } from "../generated/schema";
import { generateTransferEvent } from "./mock-event-generator";

describe("Noun Token", () => {
    describe("Transfer Handler", () => {
        beforeEach(() => {
            clearStore();
        });

        test("Should dismiss a noun if 'to' address is not a fractional vault address", () => {
            // Given
            const fractionalVaultId = "0x7f75136F3fBCc696941187d1077CDC581690E48d".toLowerCase();
            const fractionalVault = new Vault(fractionalVaultId);
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
            fractionalVault.save();
            const tokenId = 1;
            const fractionalNoun = new Noun(tokenId.toString());
            fractionalNoun.save();
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

        test("Should remove a noun and all its related entities if 'from' address is a fractional vault address", () => {
            // Given
            const auction1Bid1 = new Bid("");
            const auction1 = new Auction("1");
            const auction2 = new Auction("2");
            const nounlet1 = new Nounlet("1");
            nounlet1.auction = auction1.id;
            nounlet1.save();
            const nounlet2 = new Nounlet("2");
            nounlet2.auction = auction2.id;
            nounlet2.save();
            const noun = new Noun("400");
            noun.nounlets = [nounlet1.id, nounlet2.id];
            noun.save();
        });
    });
});
