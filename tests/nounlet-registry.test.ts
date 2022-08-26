import { assert, beforeEach, describe, test } from "matchstick-as/assembly";
import { clearStore } from "matchstick-as";
import { handleVaultDeployed } from "../src/nounlet-registry";
import { generateVaultDeployedEvent } from "./mock-event-generator";

describe("Nounlet Registry", () => {
    beforeEach(() => {
        clearStore();
    });

    describe("Vault Deployed Handler", () => {
        test("Should store the deployed nounlet vault", () => {
            // Given
            const vaultId = "0x1d46cC986B0a2f4ef4eD793258D645d326fFFd5C".toLowerCase();
            const nounAddress = "0xaCeCa7553D6C92D8513465149867e1067b27A3DD".toLowerCase();
            const nounId = 233;

            // When
            handleVaultDeployed(generateVaultDeployedEvent(vaultId, nounAddress, nounId));

            // Then
            assert.fieldEquals("Vault", vaultId, "id", vaultId);
        });
    });
});
