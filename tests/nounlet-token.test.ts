import { assert, beforeEach, describe, test } from "matchstick-as/assembly";
import { clearStore } from "matchstick-as";
import { Account, Delegate, Nounlet } from "../generated/schema";
import {
    handleDelegateChanged,
    handleDelegateVotesChanged,
    handleTransferBatch,
    handleTransferSingle,
} from "../src/nounlet-token";
import {
    generateDelegateChangedEvent,
    generateDelegateVotesChangedEvent,
    generateTransferBatchEvent,
    generateTransferSingleEvent,
} from "./mock-event-generator";
import { BigInt, log } from "@graphprotocol/graph-ts";

describe("Nounlet Token", () => {
    beforeEach(() => {
        clearStore();
    });

    describe("Delegate Vote Changed Handler", () => {
        test("Should persist a new vote balance if a voter votes for a delegate", () => {
            // Given
            const delegate = new Delegate("0xf68B2A070675641156ce6729d2f1854ec7539859".toLowerCase());
            delegate.delegatedVotes = BigInt.fromI32(100);
            delegate.delegatedVotesRaw = BigInt.fromI32(100);
            delegate.save();
            const nounId = 1;
            const newDelegatedVotes = 130;

            // When
            handleDelegateVotesChanged(
                generateDelegateVotesChangedEvent(
                    delegate.id,
                    nounId,
                    delegate.delegatedVotes.toI32(),
                    newDelegatedVotes
                )
            );

            // Then
            assert.fieldEquals("Delegate", delegate.id, "delegatedVotes", newDelegatedVotes.toString());
            assert.fieldEquals("Delegate", delegate.id, "delegatedVotesRaw", newDelegatedVotes.toString());
        });

        test("Should persist a new vote balance if a voter votes for a delegate even if the delegate does not exist in the store", () => {
            // Given
            const delegateId = "0x64Ac21d06E207e537AF4870300c73bE1b11974e0".toLowerCase();
            const nounId = 1;
            const newDelegatedVotes = 233;

            // When
            handleDelegateVotesChanged(generateDelegateVotesChangedEvent(delegateId, nounId, 200, newDelegatedVotes));

            // Then
            assert.fieldEquals("Delegate", delegateId, "delegatedVotes", newDelegatedVotes.toString());
            assert.fieldEquals("Delegate", delegateId, "delegatedVotesRaw", newDelegatedVotes.toString());
        });
    });

    describe("Delegate Changed Handler", function () {
        test("Should change a delegate but leave nounlets represented untouched when a delegator is not recorded in the store", () => {
            // Given
            const delegatorId = "0x5cf4D1Af505e764e71a22707Caede2729bab96cf".toLowerCase();
            const nounId = 2;
            const fromDelegate = new Delegate("0xef9E15c8d6B0108CC2C48Bfa0a6E46CDAba879E9".toLowerCase());
            fromDelegate.tokenHoldersRepresentedAmount = 25;
            fromDelegate.nounletsRepresented = ["1", "2", "3", "4", "5"];
            fromDelegate.save();
            const toDelegate = new Delegate("0x60109694FEAA5233ECCe51f82F3f83Df0b1E2542".toLowerCase());
            toDelegate.tokenHoldersRepresentedAmount = 15;
            toDelegate.nounletsRepresented = ["100", "200", "300"];
            toDelegate.save();

            // When
            handleDelegateChanged(generateDelegateChangedEvent(delegatorId, nounId, fromDelegate.id, toDelegate.id));

            // Then
            assert.fieldEquals(
                "Delegate",
                fromDelegate.id,
                "tokenHoldersRepresentedAmount",
                (fromDelegate.tokenHoldersRepresentedAmount - 1).toString()
            );
            // Nounlets represented are still the same as there was no delegator in the store
            assert.fieldEquals("Delegate", fromDelegate.id, "nounletsRepresented", "[1, 2, 3, 4, 5]");
            assert.fieldEquals(
                "Delegate",
                toDelegate.id,
                "tokenHoldersRepresentedAmount",
                (toDelegate.tokenHoldersRepresentedAmount + 1).toString()
            );
            // Nounlets represented are still the same as there was no delegator in the store
            assert.fieldEquals("Delegate", toDelegate.id, "nounletsRepresented", "[100, 200, 300]");
            assert.fieldEquals("Account", delegatorId, "nounlets", "[]");
            assert.fieldEquals("Account", delegatorId, "delegate", toDelegate.id);
        });

        test("Should change a delegate even if previous delegate is not recorded in the store", () => {
            // Given
            const fromDelegateId = "0xef9E15c8d6B0108CC2C48Bfa0a6E46CDAba879E9".toLowerCase();
            const nounId = 2;
            const delegator = new Account("0x85825e345aA4E61e87F7b5C47C80Dd4dBFA9B0F3".toLowerCase());
            delegator.delegate = null;
            delegator.nounlets = ["1", "2", "3"];
            delegator.save();
            const toDelegate = new Delegate("0x60109694FEAA5233ECCe51f82F3f83Df0b1E2542".toLowerCase());
            toDelegate.tokenHoldersRepresentedAmount = 40;
            toDelegate.nounletsRepresented = ["7", "8", "9"];
            toDelegate.save();

            // When
            handleDelegateChanged(generateDelegateChangedEvent(delegator.id, nounId, fromDelegateId, toDelegate.id));

            // Then
            assert.fieldEquals("Delegate", fromDelegateId, "tokenHoldersRepresentedAmount", "0");
            assert.fieldEquals("Delegate", fromDelegateId, "nounletsRepresented", "[]");
            assert.fieldEquals("Delegate", toDelegate.id, "tokenHoldersRepresentedAmount", "41");
            assert.fieldEquals("Delegate", toDelegate.id, "nounletsRepresented", "[7, 8, 9, 1, 2, 3]");
            assert.fieldEquals("Account", delegator.id, "nounlets", "[1, 2, 3]");
            assert.fieldEquals("Account", delegator.id, "delegate", toDelegate.id);
        });

        test("Should change a delegate even if a new delegate is not recorded in the store", () => {
            // Given
            const toDelegateId = "0xfAf5cA17d4e5842DF3258FCe89Feb51c2eb1c511".toLowerCase();
            const nounId = 2;
            const delegator = new Account("0x85825e345aA4E61e87F7b5C47C80Dd4dBFA9B0F3".toLowerCase());
            delegator.delegate = null;
            delegator.nounlets = ["11", "22", "5"];
            delegator.save();
            const fromDelegate = new Delegate("0xD448046c06bcbf0D4729B0c29757c08386354785".toLowerCase());
            fromDelegate.tokenHoldersRepresentedAmount = 23;
            fromDelegate.nounletsRepresented = ["11", "22", "33"];
            fromDelegate.save();

            // When
            handleDelegateChanged(generateDelegateChangedEvent(delegator.id, nounId, fromDelegate.id, toDelegateId));

            // Then
            assert.fieldEquals(
                "Delegate",
                fromDelegate.id,
                "tokenHoldersRepresentedAmount",
                (fromDelegate.tokenHoldersRepresentedAmount - 1).toString()
            );
            assert.fieldEquals("Delegate", fromDelegate.id, "nounletsRepresented", "[33]");
            assert.fieldEquals("Delegate", toDelegateId, "tokenHoldersRepresentedAmount", "1");
            assert.fieldEquals("Delegate", toDelegateId, "nounletsRepresented", "[11, 22, 5]");
            assert.fieldEquals("Account", delegator.id, "nounlets", "[11, 22, 5]");
            assert.fieldEquals("Account", delegator.id, "delegate", toDelegateId);
        });

        test("Should change a delegate if all entities exist in the store", () => {
            // Given
            const nounId = 3;
            const delegator = new Account("0xC18A9A482B61F89e4B0aa1D2Ce40E3eD85CF9D29".toLowerCase());
            const fromDelegate = new Delegate("0x6b36434336cC77E50F52F3446A50B0D82D70216D".toLowerCase());
            const toDelegate = new Delegate("0x272cc7BEeb64D8F4ef4EA29Fba491Ae4af466d83".toLowerCase());
            delegator.delegate = fromDelegate.id;
            delegator.nounlets = ["123", "456"];
            fromDelegate.tokenHoldersRepresentedAmount = 77;
            fromDelegate.nounletsRepresented = ["456", "22"];
            toDelegate.tokenHoldersRepresentedAmount = 99;
            toDelegate.nounletsRepresented = ["1", "2", "3"];
            fromDelegate.save();
            toDelegate.save();
            delegator.save();

            // When
            handleDelegateChanged(generateDelegateChangedEvent(delegator.id, nounId, fromDelegate.id, toDelegate.id));

            // Then
            assert.fieldEquals(
                "Delegate",
                fromDelegate.id,
                "tokenHoldersRepresentedAmount",
                (fromDelegate.tokenHoldersRepresentedAmount - 1).toString()
            );
            assert.fieldEquals("Delegate", fromDelegate.id, "nounletsRepresented", "[22]");
            assert.fieldEquals(
                "Delegate",
                toDelegate.id,
                "tokenHoldersRepresentedAmount",
                (toDelegate.tokenHoldersRepresentedAmount + 1).toString()
            );
            assert.fieldEquals("Delegate", toDelegate.id, "nounletsRepresented", "[1, 2, 3, 123, 456]");
            assert.fieldEquals("Account", delegator.id, "nounlets", "[123, 456]");
            assert.fieldEquals("Account", delegator.id, "delegate", toDelegate.id);
        });
    });

    describe("Single Transfer Handler", () => {
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
