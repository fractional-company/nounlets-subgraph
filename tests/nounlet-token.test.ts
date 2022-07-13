import { assert, beforeEach, describe, test } from "matchstick-as/assembly";
import { clearStore } from "matchstick-as";
import { Account, Nounlet } from "../generated/schema";
import { handleTransferSingle } from "../src/nounlet-token";
import { generateTransferSingleEvent } from "./mock-event-generator";
import { BigInt, log } from "@graphprotocol/graph-ts";

describe("DFERC1155 Contract", () => {
    describe("Single Transfer Handler", () => {
        beforeEach(() => {
            clearStore();
        });

        // test("Should ignore the transfer if a Nounlet is not in the store", () => {
        //     // Given
        // });

        test("Should transfer a Nounlet from one account to another", () => {
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
            const updatedSender = changetype<Account>(Account.load(senderAddress));
            const updatedReceiver = changetype<Account>(Account.load(receiverAddress));

            // Then
            assert.fieldEquals("Nounlet", nounlet.id.toString(), "id", nounlet.id.toString());
            assert.fieldEquals("Account", sender.id, "nounlets", updatedSender.nounlets.toString());
            assert.fieldEquals("Account", receiver.id, "nounlets", updatedReceiver.nounlets.toString());
        });

        test("Should transfer a Nounlet from one account to another even if the sender does not exist in the store", () => {});

        test("Should transfer a Nounlet from one account to another even if the receiver does not exist in the store", () => {});
    });
});
