import { assert, describe, test } from "matchstick-as/assembly";
import { findOrCreateNoun, findOrNewVault } from "../src/utils/helpers";
import { handleClaimDelegate } from "../src/nounlet-governance";
import { generateClaimDelegateEvent } from "./mock-event-generator";

describe("Nounlet Governance", () => {
    describe("Claim Delegate Handler", () => {
        test("Should not set a current delegate if the vault is missing", () => {
            // Given
            const vaultAddress = "0xCad690852d7735a978017fa6A4Df97A528E6747E".toLowerCase();
            const previousDelegate = "0x7e51Db0A515e6C88cD20Dd8FC7c3dE5e803dA817".toLowerCase();
            const currentDelegate = "0x0344b8dca50f6BC58C05EAA77e78cfB45c130AE2".toLowerCase();

            // When
            handleClaimDelegate(generateClaimDelegateEvent(vaultAddress, previousDelegate, currentDelegate));

            // Then
            assert.notInStore("Vault", vaultAddress);
        });

        test("Should set a current Noun delegate", () => {
            // Given
            const vaultAddress = "0xCad690852d7735a978017fa6A4Df97A528E6747E".toLowerCase();
            const previousDelegate = "0x7e51Db0A515e6C88cD20Dd8FC7c3dE5e803dA817".toLowerCase();
            const currentDelegate = "0x0344b8dca50f6BC58C05EAA77e78cfB45c130AE2".toLowerCase();
            const noun = findOrCreateNoun("1");

            const vault = findOrNewVault(vaultAddress);
            vault.noun = noun.id;
            vault.save();

            // When
            handleClaimDelegate(generateClaimDelegateEvent(vaultAddress, previousDelegate, currentDelegate));

            // Then
            assert.fieldEquals("Noun", noun.id, "currentDelegate", currentDelegate);
        });
    });
});
