import { assert, beforeEach, describe, test } from "matchstick-as/assembly";
import { clearStore } from "matchstick-as";
import { Account, Delegate, Noun, Nounlet } from "../generated/schema";
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
import {
    findOrCreateAccount,
    findOrCreateDelegate,
    findOrNewAccount,
    findOrNewDelegate,
    findOrNewDelegateVote,
    findOrNewNounlet,
} from "../src/utils/helpers";

describe("Nounlet Token", () => {
    beforeEach(() => {
        clearStore();
    });

    describe("Delegate Vote Changed Handler", () => {
        test("Should not store a vote if the noun was moved from fractional vault", () => {
            // Given
            const nounletId = 1;
            const nounlet = findOrNewNounlet(nounletId.toString());
            nounlet.save();
            const delegateAddress = "0xf68B2A070675641156ce6729d2f1854ec7539859".toLowerCase();
            const delegateId = findOrNewDelegate(delegateAddress, "3").id;
            const previousDelegatedVotes = 100;
            const newDelegatedVotes = 130;

            // When
            handleDelegateVotesChanged(
                generateDelegateVotesChangedEvent(delegateAddress, nounletId, previousDelegatedVotes, newDelegatedVotes)
            );

            // Then
            assert.notInStore("DelegateVote", delegateId.concat("-").concat(nounlet.id));
        });

        test("Should persist a new delegate vote when a delegate gets his votes changed", () => {
            // Given
            const nounId = "2";
            const nounlet = findOrNewNounlet("1");
            nounlet.noun = nounId;
            nounlet.save();

            const delegateAddress = "0xf68B2A070675641156ce6729d2f1854ec7539859".toLowerCase();
            const delegateId = findOrNewDelegate(delegateAddress, nounId).id;
            const previousDelegatedVotes = 125;
            const newDelegatedVotes = 130;

            // When
            const event = generateDelegateVotesChangedEvent(
                delegateAddress,
                BigInt.fromString(nounlet.id).toI32(),
                previousDelegatedVotes,
                newDelegatedVotes
            );
            handleDelegateVotesChanged(event);

            // Then
            const delegateVoteId = delegateId.concat("-").concat(nounlet.id);
            assert.fieldEquals("DelegateVote", delegateVoteId, "nounlet", nounlet.id);
            assert.fieldEquals("DelegateVote", delegateVoteId, "delegate", delegateId);
            assert.fieldEquals(
                "DelegateVote",
                delegateVoteId,
                "voteAmount",
                (newDelegatedVotes - previousDelegatedVotes).toString()
            );
            assert.fieldEquals("DelegateVote", delegateVoteId, "timestamp", event.block.timestamp.toString());
        });

        test("Should correctly save delegate vote amount even if a delegate loses votes", () => {
            // Given
            const nounId = "2";
            const nounlet = findOrNewNounlet("1");
            nounlet.noun = nounId;
            nounlet.save();

            const delegateAddress = "0xf68B2A070675641156ce6729d2f1854ec7539859".toLowerCase();
            const delegateId = findOrNewDelegate(delegateAddress, nounId).id;
            const previousDelegatedVotes = 75;
            const newDelegatedVotes = 50;

            // When
            const event = generateDelegateVotesChangedEvent(
                delegateAddress,
                BigInt.fromString(nounlet.id).toI32(),
                previousDelegatedVotes,
                newDelegatedVotes
            );
            handleDelegateVotesChanged(event);

            // Then
            const delegateVoteId = delegateId.concat("-").concat(nounlet.id);
            assert.fieldEquals(
                "DelegateVote",
                delegateVoteId,
                "voteAmount",
                (previousDelegatedVotes - newDelegatedVotes).toString()
            );
        });
    });

    describe("Delegate Changed Handler", () => {
        test("Should not change a delegate if a nounlet does not exist", () => {
            // Given
            const nounId = 1;
            const nounletId = 99;
            const delegatorAddress = "0xa5B7c887A47653E7076e73A7bd3F19e9cF1EEfbA".toLowerCase();
            const oldDelegateAddress = "0xA55faC158c179C0BfFe814A5Fa0B79604E346cF6".toLowerCase();
            const newDelegateAddress = "0xeD804cED1Da0DCc38473666C2a6504a70867Cc60".toLowerCase();
            const newDelegate = findOrCreateDelegate(newDelegateAddress, nounId.toString());

            // When
            handleDelegateChanged(
                generateDelegateChangedEvent(delegatorAddress, nounletId, oldDelegateAddress, newDelegateAddress)
            );

            // Then
            assert.fieldEquals("Delegate", newDelegate.id, "nounletsRepresented", "[]");
        });

        test("Should not change a delegate if a noun was moved from fractional vault", () => {
            // Given
            const nounId = 10;
            const delegatorAddress = "0xa5B7c887A47653E7076e73A7bd3F19e9cF1EEfbA".toLowerCase();
            const oldDelegateAddress = "0xA55faC158c179C0BfFe814A5Fa0B79604E346cF6".toLowerCase();
            const oldDelegate = findOrCreateDelegate(oldDelegateAddress, nounId.toString());
            const newDelegateAddress = "0xeD804cED1Da0DCc38473666C2a6504a70867Cc60".toLowerCase();
            const newDelegate = findOrCreateDelegate(newDelegateAddress, nounId.toString());
            const nounlet = findOrNewNounlet("1");
            nounlet.holder = delegatorAddress;
            nounlet.delegate = findOrNewDelegate(oldDelegateAddress, nounId.toString()).id;
            nounlet.save();

            // When
            handleDelegateChanged(
                generateDelegateChangedEvent(
                    delegatorAddress,
                    BigInt.fromString(nounlet.id).toI32(),
                    oldDelegateAddress,
                    newDelegateAddress
                )
            );

            // Then
            assert.fieldEquals("Nounlet", nounlet.id, "delegate", oldDelegate.id);
            assert.fieldEquals("Delegate", oldDelegate.id, "nounletsRepresented", `[${nounlet.id}]`);
            assert.fieldEquals("Delegate", newDelegate.id, "nounletsRepresented", "[]");
        });

        test("Should change a delegate", () => {
            // Given
            const nounId = 10;
            const delegatorAddress = "0xa5B7c887A47653E7076e73A7bd3F19e9cF1EEfbA".toLowerCase();
            const oldDelegateAddress = "0xA55faC158c179C0BfFe814A5Fa0B79604E346cF6".toLowerCase();
            const oldDelegate = findOrCreateDelegate(oldDelegateAddress, nounId.toString());
            const newDelegateAddress = "0xeD804cED1Da0DCc38473666C2a6504a70867Cc60".toLowerCase();
            const newDelegate = findOrCreateDelegate(newDelegateAddress, nounId.toString());
            const nounlet = findOrNewNounlet("1");
            nounlet.noun = nounId.toString();
            nounlet.holder = delegatorAddress;
            nounlet.delegate = findOrNewDelegate(oldDelegateAddress, nounId.toString()).id;
            nounlet.save();

            // When
            handleDelegateChanged(
                generateDelegateChangedEvent(
                    delegatorAddress,
                    BigInt.fromString(nounlet.id).toI32(),
                    oldDelegateAddress,
                    newDelegateAddress
                )
            );

            // Then
            assert.fieldEquals("Nounlet", nounlet.id, "delegate", newDelegate.id);
            assert.stringEquals([].toString(), oldDelegate.nounletsRepresented.toString());
            const refreshedNewDelegate = Delegate.load(newDelegate.id);
            assert.assertNotNull(refreshedNewDelegate);
            assert.stringEquals(
                [nounlet.id].toString(),
                (refreshedNewDelegate as Delegate).nounletsRepresented.toString()
            );
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

            const sender = findOrNewAccount(senderAddress);
            sender.nounlets = [nounletId.toString(), "2", "3"];
            sender.save();
            const receiver = findOrNewAccount(receiverAddress);
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

            const nounlet = findOrNewNounlet(nounletId.toString());
            nounlet.holder = senderAddress;
            nounlet.save();

            // When
            handleTransferSingle(
                generateTransferSingleEvent(operator, senderAddress, receiverAddress, nounletId, amount)
            );

            // Then
            assert.fieldEquals("Nounlet", nounlet.id.toString(), "holder", receiverAddress);
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

            const nounlet1 = findOrNewNounlet(nounletIds[0].toString());
            nounlet1.holder = senderAddress;
            nounlet1.save();
            const nounlet3 = findOrNewNounlet(nounletIds[2].toString());
            nounlet3.holder = senderAddress;
            nounlet3.save();

            // When
            handleTransferBatch(
                generateTransferBatchEvent(operator, senderAddress, receiverAddress, nounletIds, amounts)
            );

            // Then
            assert.fieldEquals("Nounlet", nounlet1.id, "holder", receiverAddress);
            assert.notInStore("Nounlet", nounletIds[1].toString());
            assert.fieldEquals("Nounlet", nounlet3.id, "holder", receiverAddress);
        });

        test("Should remove delegates from Nounlets that were transferred from one account to another", () => {
            // Given
            const nounId = "10";
            const nounletIds = [BigInt.fromString("50"), BigInt.fromString("60"), BigInt.fromString("70")];
            const amounts = [BigInt.fromString("1"), BigInt.fromString("1"), BigInt.fromString("1")];
            const delegate = findOrCreateDelegate("0x6d2F62f32b79AD7A548dF1b396040F180c678858".toLowerCase(), nounId);
            const currentHolder = findOrCreateAccount("0x07FA5BFd85Ad0A711d5961B1630a00500992f924".toLowerCase());
            const futureHolderId = "0x48D9833E96106dc1d2D4Cb15F55b50e75e58F3a5".toLowerCase();

            const nounlet1 = findOrNewNounlet(nounletIds[0].toString());
            nounlet1.noun = nounId;
            nounlet1.delegate = delegate.id;
            nounlet1.holder = currentHolder.id;
            nounlet1.save();

            const nounlet2 = findOrNewNounlet(nounletIds[1].toString());
            nounlet2.noun = nounId;
            nounlet2.delegate = delegate.id;
            nounlet2.holder = currentHolder.id;
            nounlet2.save();

            const nounlet3 = findOrNewNounlet(nounletIds[2].toString());
            nounlet3.noun = nounId;
            nounlet3.delegate = delegate.id;
            nounlet3.holder = currentHolder.id;
            nounlet3.save();

            // When
            handleTransferBatch(
                generateTransferBatchEvent(
                    "0x9Eef8d5dB3b8989646969c5df65b4Cf179Aa462D",
                    currentHolder.id,
                    futureHolderId,
                    nounletIds,
                    amounts
                )
            );

            // Then
            assert.fieldEquals("Nounlet", nounlet1.id, "delegate", "null");
            assert.fieldEquals("Nounlet", nounlet2.id, "delegate", "null");
            assert.fieldEquals("Nounlet", nounlet3.id, "delegate", "null");
            assert.stringEquals([].toString(), delegate.nounletsRepresented.toString());
        });
    });
});
