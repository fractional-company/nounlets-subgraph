import { assert, beforeEach, describe, test } from "matchstick-as/assembly";
import { clearStore } from "matchstick-as";
import { Account, Nounlet } from "../generated/schema";
import { handleTransferBatch, handleTransferSingle } from "../src/nounlet-token";
import { generateTransferBatchEvent, generateTransferSingleEvent } from "./mock-event-generator";
import { BigInt, log } from "@graphprotocol/graph-ts";

describe("DFERC1155 Contract", () => {
    describe("Single Transfer Handler", () => {
        beforeEach(() => {
            clearStore();
        });

        test("Should ignore the transfer if a Nounlet is not in the store", () => {
            // Given
            const operator = "0xa5B7c887A47653E7076e73A7bd3F19e9cF1EEfbA".toLowerCase();
            const nounletId = BigInt.fromU32(1 as u32);
            const senderAddress = "0xA55faC158c179C0BfFe814A5Fa0B79604E346cF6".toLowerCase();
            const receiverAddress = "0xeD804cED1Da0DCc38473666C2a6504a70867Cc60".toLowerCase();
            const amount = BigInt.fromU32(1 as u32);

            const sender = new Account(senderAddress);
            sender.nounlets = [nounletId.toString(), "2", "3"];
            sender.save();
            const receiver = new Account(receiverAddress);
            receiver.nounlets = [];
            receiver.save();

            // When
            handleTransferSingle(
                generateTransferSingleEvent(operator, senderAddress, receiverAddress, nounletId, amount)
            );

            // Then
            assert.notInStore("Nounlet", nounletId.toString());
            assert.fieldEquals("Account", sender.id.toString(), "nounlets", `[${nounletId.toString()}, 2, 3]`);
            assert.fieldEquals("Account", receiver.id.toString(), "nounlets", "[]");
        });

        test("Should transfer a Nounlet from sender to receiver", () => {
            // Given
            const operator = "0xa5B7c887A47653E7076e73A7bd3F19e9cF1EEfbA".toLowerCase();
            const nounletId = BigInt.fromU32(1 as u32);
            const senderAddress = "0xA55faC158c179C0BfFe814A5Fa0B79604E346cF6".toLowerCase();
            const receiverAddress = "0xeD804cED1Da0DCc38473666C2a6504a70867Cc60".toLowerCase();
            const amount = BigInt.fromU32(1 as u32);

            const sender = new Account(senderAddress);
            const receiver = new Account(receiverAddress);
            const nounlet = new Nounlet(nounletId.toString());

            sender.nounlets = [nounletId.toString(), "3", "6"];
            receiver.nounlets = [];
            sender.save();
            receiver.save();
            nounlet.save();

            // When
            handleTransferSingle(
                generateTransferSingleEvent(operator, senderAddress, receiverAddress, nounletId, amount)
            );

            // Then
            assert.fieldEquals("Nounlet", nounlet.id.toString(), "id", nounlet.id.toString());
            assert.fieldEquals("Account", sender.id, "nounlets", "[3, 6]");
            assert.fieldEquals("Account", receiver.id, "nounlets", `[${nounletId.toString()}]`);
        });

        test("Should transfer a Nounlet to receiver even if the sender does not exist in the store", () => {
            // Given
            const operator = "0xa5B7c887A47653E7076e73A7bd3F19e9cF1EEfbA".toLowerCase();
            const nounletId = BigInt.fromU32(1 as u32);
            const senderAddress = "0xA55faC158c179C0BfFe814A5Fa0B79604E346cF6".toLowerCase();
            const receiverAddress = "0xeD804cED1Da0DCc38473666C2a6504a70867Cc60".toLowerCase();
            const amount = BigInt.fromU32(1 as u32);

            const receiver = new Account(receiverAddress);
            receiver.nounlets = ["10", "20"];
            receiver.save();
            const nounlet = new Nounlet(nounletId.toString());
            nounlet.save();

            // When
            handleTransferSingle(
                generateTransferSingleEvent(operator, senderAddress, receiverAddress, nounletId, amount)
            );

            // Then
            assert.fieldEquals("Nounlet", nounlet.id.toString(), "id", nounlet.id.toString());
            assert.fieldEquals("Account", senderAddress, "nounlets", "[]");
            assert.fieldEquals("Account", receiverAddress, "nounlets", `[10, 20, ${nounlet.id.toString()}]`);
        });

        test("Should transfer a Nounlet from sender to receiver even if the receiver does not exist in the store", () => {
            // Given
            const operator = "0xa5B7c887A47653E7076e73A7bd3F19e9cF1EEfbA".toLowerCase();
            const nounletId = BigInt.fromU32(1 as u32);
            const senderAddress = "0xA55faC158c179C0BfFe814A5Fa0B79604E346cF6".toLowerCase();
            const receiverAddress = "0xeD804cED1Da0DCc38473666C2a6504a70867Cc60".toLowerCase();
            const amount = BigInt.fromU32(1 as u32);

            const sender = new Account(senderAddress);
            sender.nounlets = ["10", "20", nounletId.toString()];
            sender.save();
            const nounlet = new Nounlet(nounletId.toString());
            nounlet.save();

            // When
            handleTransferSingle(
                generateTransferSingleEvent(operator, senderAddress, receiverAddress, nounletId, amount)
            );

            // Then
            assert.fieldEquals("Nounlet", nounlet.id.toString(), "id", nounlet.id.toString());
            assert.fieldEquals("Account", senderAddress, "nounlets", "[10, 20]");
            assert.fieldEquals("Account", receiverAddress, "nounlets", `[${nounlet.id.toString()}]`);
        });
    });

    describe("Batch Transfer Handler", () => {
        beforeEach(() => {
            clearStore();
        });

        test("Should transfer Nounlets from sender to receiver but ignore the ones that are not in the store", () => {
            // Given
            const operator = "0xa5B7c887A47653E7076e73A7bd3F19e9cF1EEfbA".toLowerCase();
            const nounletIds = [BigInt.fromU32(33 as u32), BigInt.fromU32(69 as u32), BigInt.fromU32(420 as u32)];
            const senderAddress = "0xA55faC158c179C0BfFe814A5Fa0B79604E346cF6".toLowerCase();
            const receiverAddress = "0xeD804cED1Da0DCc38473666C2a6504a70867Cc60".toLowerCase();
            const amounts = [BigInt.fromU32(1 as u32), BigInt.fromU32(1 as u32)];

            const sender = new Account(senderAddress);
            const receiver = new Account(receiverAddress);
            const nounlet1 = new Nounlet(nounletIds[0].toString());
            const nounlet3 = new Nounlet(nounletIds[2].toString());

            // Nounlet with index 1 is in possession by a sender but it's not in the store
            sender.nounlets = [nounlet1.id.toString(), nounletIds[1].toString(), nounlet3.id.toString(), "50"];
            receiver.nounlets = ["77"];
            sender.save();
            receiver.save();
            nounlet1.save();
            nounlet3.save();

            // When
            handleTransferBatch(
                generateTransferBatchEvent(operator, senderAddress, receiverAddress, nounletIds, amounts)
            );

            // Then
            assert.fieldEquals("Nounlet", nounlet1.id.toString(), "id", nounlet1.id.toString());
            assert.notInStore("Nounlet", nounletIds[1].toString());
            assert.fieldEquals("Nounlet", nounlet3.id.toString(), "id", nounlet3.id.toString());
            assert.fieldEquals("Account", sender.id.toString(), "nounlets", `[${nounletIds[1].toString()}, 50]`);
            assert.fieldEquals(
                "Account",
                receiver.id.toString(),
                "nounlets",
                `[77, ${nounlet1.id.toString()}, ${nounlet3.id.toString()}]`
            );
        });

        test("Should transfer Nounlets to receiver even if the sender does not exist in the store", () => {
            // Given
            const operator = "0xa5B7c887A47653E7076e73A7bd3F19e9cF1EEfbA".toLowerCase();
            const nounletIds = [BigInt.fromU32(33 as u32), BigInt.fromU32(69 as u32), BigInt.fromU32(420 as u32)];
            const senderAddress = "0xA55faC158c179C0BfFe814A5Fa0B79604E346cF6".toLowerCase();
            const receiverAddress = "0xeD804cED1Da0DCc38473666C2a6504a70867Cc60".toLowerCase();
            const amounts = [BigInt.fromU32(1 as u32), BigInt.fromU32(1 as u32)];

            const receiver = new Account(receiverAddress);
            const nounlet1 = new Nounlet(nounletIds[0].toString());
            const nounlet2 = new Nounlet(nounletIds[1].toString());
            const nounlet3 = new Nounlet(nounletIds[2].toString());

            receiver.nounlets = ["77"];
            receiver.save();
            nounlet1.save();
            nounlet2.save();
            nounlet3.save();

            // When
            handleTransferBatch(
                generateTransferBatchEvent(operator, senderAddress, receiverAddress, nounletIds, amounts)
            );

            // Then
            assert.fieldEquals("Nounlet", nounlet1.id.toString(), "id", nounlet1.id.toString());
            assert.fieldEquals("Nounlet", nounlet2.id.toString(), "id", nounlet2.id.toString());
            assert.fieldEquals("Nounlet", nounlet3.id.toString(), "id", nounlet3.id.toString());
            assert.fieldEquals("Account", senderAddress, "nounlets", `[]`);
            assert.fieldEquals(
                "Account",
                receiver.id.toString(),
                "nounlets",
                `[77, ${nounlet1.id.toString()}, ${nounlet2.id.toString()}, ${nounlet3.id.toString()}]`
            );
        });

        test("Should transfer Nounlets from sender to receiver even if the receiver does not exist in the store", () => {
            // Given
            const operator = "0xa5B7c887A47653E7076e73A7bd3F19e9cF1EEfbA".toLowerCase();
            const nounletIds = [BigInt.fromU32(33 as u32), BigInt.fromU32(69 as u32), BigInt.fromU32(420 as u32)];
            const senderAddress = "0xA55faC158c179C0BfFe814A5Fa0B79604E346cF6".toLowerCase();
            const receiverAddress = "0xeD804cED1Da0DCc38473666C2a6504a70867Cc60".toLowerCase();
            const amounts = [BigInt.fromU32(1 as u32), BigInt.fromU32(1 as u32)];

            const sender = new Account(senderAddress);
            const nounlet1 = new Nounlet(nounletIds[0].toString());
            const nounlet2 = new Nounlet(nounletIds[1].toString());
            const nounlet3 = new Nounlet(nounletIds[2].toString());

            sender.nounlets = [nounlet1.id.toString(), nounlet2.id.toString(), nounlet3.id.toString(), "50"];
            sender.save();
            nounlet1.save();
            nounlet2.save();
            nounlet3.save();

            // When
            handleTransferBatch(
                generateTransferBatchEvent(operator, senderAddress, receiverAddress, nounletIds, amounts)
            );

            // Then
            assert.fieldEquals("Nounlet", nounlet1.id.toString(), "id", nounlet1.id.toString());
            assert.fieldEquals("Nounlet", nounlet2.id.toString(), "id", nounlet2.id.toString());
            assert.fieldEquals("Nounlet", nounlet3.id.toString(), "id", nounlet3.id.toString());
            assert.fieldEquals("Account", senderAddress, "nounlets", `[50]`);
            assert.fieldEquals(
                "Account",
                receiverAddress,
                "nounlets",
                `[${nounlet1.id.toString()}, ${nounlet2.id.toString()}, ${nounlet3.id.toString()}]`
            );
        });
    });
});
