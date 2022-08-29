import { assert, beforeEach, describe, test } from "matchstick-as/assembly";
import { clearStore } from "matchstick-as";
import { Account, Delegate, Nounlet } from "../generated/schema";
import { handleDelegateChanged, handleTransferBatch, handleTransferSingle } from "../src/nounlet-token";
import {
    generateDelegateChangedEvent,
    generateTransferBatchEvent,
    generateTransferSingleEvent,
} from "./mock-event-generator";
import { BigInt, log } from "@graphprotocol/graph-ts";
import {
    findOrCreateAccount,
    findOrCreateDelegate,
    findOrNewNounlet,
    generateDelegateVoteId,
} from "../src/utils/helpers";

describe("Nounlet Token", () => {
    beforeEach(() => {
        clearStore();
    });

    describe("Delegate Changed Handler", () => {
        // test("Should not change a delegate if a noun was moved from fractional vault", () => {
        //     // Given
        //     const nounId = 10;
        //     const tokenId = 1;
        //     const tokenAddress = "0xFBE119605a716dc275f4A5dd1A913d6ADdb792D4".toLowerCase();
        //     const delegatorAddress = "0xa5B7c887A47653E7076e73A7bd3F19e9cF1EEfbA".toLowerCase();
        //     const oldDelegateAddress = "0xA55faC158c179C0BfFe814A5Fa0B79604E346cF6".toLowerCase();
        //     const oldDelegate = findOrCreateDelegate(oldDelegateAddress, tokenAddress);
        //     const newDelegateAddress = "0xeD804cED1Da0DCc38473666C2a6504a70867Cc60".toLowerCase();
        //     const newDelegate = findOrCreateDelegate(newDelegateAddress, tokenAddress);
        //     const nounlet = findOrNewNounlet(tokenId.toString(), tokenAddress);
        //     nounlet.holder = delegatorAddress;
        //     nounlet.delegate = findOrNewDelegate(oldDelegateAddress, nounId.toString()).id;
        //     nounlet.save();
        //
        //     // When
        //     handleDelegateChanged(
        //         generateDelegateChangedEvent(
        //             tokenAddress,
        //             tokenId,
        //             delegatorAddress,
        //             oldDelegateAddress,
        //             newDelegateAddress
        //         )
        //     );
        //
        //     // Then
        //     assert.fieldEquals("Nounlet", nounlet.id, "delegate", oldDelegate.id);
        //     assert.fieldEquals("Delegate", oldDelegate.id, "nounletsRepresented", `[${nounlet.id}]`);
        //     const refreshedNewDelegate = Delegate.load(newDelegate.id) as Delegate;
        //     log.info("Delegate nounlets: {}", [(refreshedNewDelegate.nounletsRepresented as string[]).toString()]);
        //     // assert.stringEquals("[]", refreshedNewDelegate.nounletsRepresented!.toString());
        // });

        test("Should change a delegate on delegator's nounlets", () => {
            // Given
            const nounId = 10;
            const tokenAddress = "0xFBE119605a716dc275f4A5dd1A913d6ADdb792D4".toLowerCase();
            const delegatorAddress = "0xa5B7c887A47653E7076e73A7bd3F19e9cF1EEfbA".toLowerCase();
            const oldDelegateAddress = "0xA55faC158c179C0BfFe814A5Fa0B79604E346cF6".toLowerCase();
            const newDelegateAddress = "0xeD804cED1Da0DCc38473666C2a6504a70867Cc60".toLowerCase();

            const holder = findOrCreateAccount(delegatorAddress, tokenAddress);
            const oldDelegate = findOrCreateDelegate(oldDelegateAddress, tokenAddress);
            const newDelegate = findOrCreateDelegate(newDelegateAddress, tokenAddress);

            const nounlet1 = findOrNewNounlet("1", tokenAddress);
            nounlet1.noun = nounId.toString();
            nounlet1.holder = holder.id;
            nounlet1.delegate = oldDelegate.id;
            nounlet1.save();

            const nounlet2 = findOrNewNounlet("2", tokenAddress);
            nounlet2.noun = nounId.toString();
            nounlet2.holder = holder.id;
            nounlet2.delegate = oldDelegate.id;
            nounlet2.save();

            const nounlet3 = findOrNewNounlet("3", tokenAddress);
            nounlet3.noun = nounId.toString();
            nounlet3.holder = holder.id;
            nounlet3.delegate = oldDelegate.id;
            nounlet3.save();

            // When
            handleDelegateChanged(
                generateDelegateChangedEvent(tokenAddress, delegatorAddress, oldDelegateAddress, newDelegateAddress)
            );

            // Then
            const refreshedOldDelegate = Delegate.load(oldDelegate.id) as Delegate;
            const refreshedNewDelegate = Delegate.load(newDelegate.id) as Delegate;
            assert.fieldEquals("Nounlet", nounlet1.id, "delegate", newDelegate.id);
            assert.fieldEquals("Nounlet", nounlet2.id, "delegate", newDelegate.id);
            assert.fieldEquals("Nounlet", nounlet3.id, "delegate", newDelegate.id);
            assert.stringEquals([].toString(), refreshedOldDelegate.nounletsRepresented.toString());
            assert.assertNotNull(refreshedNewDelegate);
            assert.assertTrue(refreshedNewDelegate.nounletsRepresented.includes(nounlet1.id) as boolean);
            assert.assertTrue(refreshedNewDelegate.nounletsRepresented.includes(nounlet2.id) as boolean);
            assert.assertTrue(refreshedNewDelegate.nounletsRepresented.includes(nounlet3.id) as boolean);
            log.info("old delegate count: {}", [refreshedOldDelegate.nounletsRepresentedCount.toString()]);
            log.info("new delegate count: {}", [refreshedNewDelegate.nounletsRepresentedCount.toString()]);
            assert.assertTrue(refreshedOldDelegate.nounletsRepresentedCount === 0);
            assert.assertTrue(refreshedNewDelegate.nounletsRepresentedCount === 3);
        });

        test("Should record a delegate vote on delegate change", () => {
            // Given
            const nounId = 10;
            const tokenAddress = "0xFBE119605a716dc275f4A5dd1A913d6ADdb792D4".toLowerCase();
            const delegatorAddress = "0xa5B7c887A47653E7076e73A7bd3F19e9cF1EEfbA".toLowerCase();
            const oldDelegateAddress = "0xA55faC158c179C0BfFe814A5Fa0B79604E346cF6".toLowerCase();
            const newDelegateAddress = "0xeD804cED1Da0DCc38473666C2a6504a70867Cc60".toLowerCase();

            const holder = findOrCreateAccount(delegatorAddress, tokenAddress);
            const oldDelegate = findOrCreateDelegate(oldDelegateAddress, tokenAddress);
            const newDelegate = findOrCreateDelegate(newDelegateAddress, tokenAddress);

            const nounlet1 = findOrNewNounlet("1", tokenAddress);
            nounlet1.noun = nounId.toString();
            nounlet1.holder = holder.id;
            nounlet1.delegate = oldDelegate.id;
            nounlet1.save();

            const nounlet2 = findOrNewNounlet("2", tokenAddress);
            nounlet2.noun = nounId.toString();
            nounlet2.holder = holder.id;
            nounlet2.delegate = oldDelegate.id;
            nounlet2.save();

            const nounlet3 = findOrNewNounlet("3", tokenAddress);
            nounlet3.noun = nounId.toString();
            nounlet3.holder = holder.id;
            nounlet3.delegate = oldDelegate.id;
            nounlet3.save();

            // When
            handleDelegateChanged(
                generateDelegateChangedEvent(tokenAddress, delegatorAddress, oldDelegateAddress, newDelegateAddress)
            );

            // Then
            const delegateVote1Id = generateDelegateVoteId(newDelegate.id, nounlet1.id);
            const delegateVote2Id = generateDelegateVoteId(newDelegate.id, nounlet2.id);
            const delegateVote3Id = generateDelegateVoteId(newDelegate.id, nounlet3.id);
            assert.fieldEquals("DelegateVote", delegateVote1Id, "delegate", newDelegate.id);
            assert.fieldEquals("DelegateVote", delegateVote2Id, "delegate", newDelegate.id);
            assert.fieldEquals("DelegateVote", delegateVote3Id, "delegate", newDelegate.id);
            assert.fieldEquals("DelegateVote", delegateVote1Id, "nounlet", nounlet1.id);
            assert.fieldEquals("DelegateVote", delegateVote2Id, "nounlet", nounlet2.id);
            assert.fieldEquals("DelegateVote", delegateVote3Id, "nounlet", nounlet3.id);
        });
    });

    describe("Single Transfer Handler", () => {
        test("Should transfer a Nounlet from sender to receiver", () => {
            // Given
            const nounId = "10";
            const tokenAddress = "0xFBE119605a716dc275f4A5dd1A913d6ADdb792D4".toLowerCase();
            const operator = "0xa5B7c887A47653E7076e73A7bd3F19e9cF1EEfbA".toLowerCase();
            const senderAddress = "0xA55faC158c179C0BfFe814A5Fa0B79604E346cF6".toLowerCase();
            const receiverAddress = "0xeD804cED1Da0DCc38473666C2a6504a70867Cc60".toLowerCase();
            const tokenId = BigInt.fromU32(1 as u32);
            const amount = BigInt.fromU32(1 as u32);

            const sender = findOrCreateAccount(senderAddress, tokenAddress);
            const currentDelegate = findOrCreateDelegate(senderAddress, tokenAddress);

            const nounlet1 = findOrNewNounlet(tokenId.toString(), tokenAddress);
            nounlet1.noun = nounId;
            nounlet1.holder = sender.id;
            nounlet1.delegate = currentDelegate.id;
            nounlet1.save();

            const nounlet2 = findOrNewNounlet("2", tokenAddress);
            nounlet2.noun = nounId;
            nounlet2.holder = sender.id;
            nounlet2.delegate = currentDelegate.id;
            nounlet2.save();

            const nounlet3 = findOrNewNounlet("3", tokenAddress);
            nounlet3.noun = nounId;
            nounlet3.holder = sender.id;
            nounlet3.delegate = "some-delegate";
            nounlet3.save();

            sender.nounletsHeldCount = 3;
            sender.save();
            currentDelegate.nounletsRepresentedCount = 2;
            currentDelegate.save();

            const receiver = findOrCreateAccount(receiverAddress, tokenAddress);
            const newDelegate = findOrCreateDelegate(receiverAddress, tokenAddress);

            const nounlet4 = findOrNewNounlet("4", tokenAddress);
            nounlet4.noun = nounId;
            nounlet4.holder = receiver.id;
            nounlet4.delegate = newDelegate.id;
            nounlet4.save();

            const nounlet5 = findOrNewNounlet("5", tokenAddress);
            nounlet5.noun = nounId;
            nounlet5.holder = receiver.id;
            nounlet5.delegate = newDelegate.id;
            nounlet5.save();

            receiver.nounletsHeldCount = 2;
            receiver.save();
            newDelegate.nounletsRepresentedCount = 2;
            newDelegate.save();

            // When
            handleTransferSingle(
                generateTransferSingleEvent(tokenAddress, operator, senderAddress, receiverAddress, tokenId, amount)
            );

            // Then
            assert.fieldEquals("Nounlet", nounlet2.id, "holder", sender.id);
            assert.fieldEquals("Nounlet", nounlet3.id, "holder", sender.id);
            assert.fieldEquals("Account", sender.id, "nounletsHeldCount", "2");
            assert.fieldEquals("Nounlet", nounlet1.id, "holder", receiver.id);
            assert.fieldEquals("Nounlet", nounlet4.id, "holder", receiver.id);
            assert.fieldEquals("Nounlet", nounlet5.id, "holder", receiver.id);
            assert.fieldEquals("Account", receiver.id, "nounletsHeldCount", "3");
            assert.fieldEquals("Nounlet", nounlet2.id, "delegate", currentDelegate.id);
            assert.fieldEquals("Delegate", currentDelegate.id, "nounletsRepresentedCount", "1");
            assert.fieldEquals("Nounlet", nounlet1.id, "delegate", newDelegate.id);
            assert.fieldEquals("Nounlet", nounlet4.id, "delegate", newDelegate.id);
            assert.fieldEquals("Nounlet", nounlet5.id, "delegate", newDelegate.id);
            assert.fieldEquals("Delegate", newDelegate.id, "nounletsRepresentedCount", "3");
        });
    });

    describe("Batch Transfer Handler", () => {
        test("Should transfer Nounlets from sender to receiver", () => {
            // Given
            const nounId = "10";
            const tokenAddress = "0xFBE119605a716dc275f4A5dd1A913d6ADdb792D4".toLowerCase();
            const operator = "0xa5B7c887A47653E7076e73A7bd3F19e9cF1EEfbA".toLowerCase();
            const senderAddress = "0xA55faC158c179C0BfFe814A5Fa0B79604E346cF6".toLowerCase();
            const receiverAddress = "0xeD804cED1Da0DCc38473666C2a6504a70867Cc60".toLowerCase();
            const amounts = [BigInt.fromString("1"), BigInt.fromString("1"), BigInt.fromString("1")];
            const tokenIds = [BigInt.fromString("1"), BigInt.fromString("2"), BigInt.fromString("3")];

            const sender = findOrCreateAccount(senderAddress, tokenAddress);
            const currentDelegate = findOrCreateDelegate(senderAddress, tokenAddress);
            const currentDelegate2 = findOrCreateDelegate(
                "0x34D842d327144397d29E086eebeea70B981D93a8".toLowerCase(),
                tokenAddress
            );

            const nounlet1 = findOrNewNounlet(tokenIds[0].toString(), tokenAddress);
            nounlet1.noun = nounId;
            nounlet1.holder = sender.id;
            nounlet1.delegate = currentDelegate.id;
            nounlet1.save();

            const nounlet2 = findOrNewNounlet(tokenIds[1].toString(), tokenAddress);
            nounlet2.noun = nounId;
            nounlet2.holder = sender.id;
            nounlet2.delegate = currentDelegate.id;
            nounlet2.save();

            const nounlet3 = findOrNewNounlet(tokenIds[2].toString(), tokenAddress);
            nounlet3.noun = nounId;
            nounlet3.holder = sender.id;
            nounlet3.delegate = currentDelegate2.id;
            nounlet3.save();

            sender.nounletsHeldCount = 3;
            sender.save();
            currentDelegate.nounletsRepresentedCount = 2;
            currentDelegate.save();
            currentDelegate2.nounletsRepresentedCount = 1;
            currentDelegate2.save();

            const receiver = findOrCreateAccount(receiverAddress, tokenAddress);
            const newDelegate = findOrCreateDelegate(receiverAddress, tokenAddress);

            const nounlet4 = findOrNewNounlet("4", tokenAddress);
            nounlet4.noun = nounId;
            nounlet4.holder = receiver.id;
            nounlet4.delegate = newDelegate.id;
            nounlet4.save();

            const nounlet5 = findOrNewNounlet("5", tokenAddress);
            nounlet5.noun = nounId;
            nounlet5.holder = receiver.id;
            nounlet5.delegate = newDelegate.id;
            nounlet5.save();

            receiver.nounletsHeldCount = 2;
            receiver.save();
            newDelegate.nounletsRepresentedCount = 2;
            newDelegate.save();

            // When
            handleTransferBatch(
                generateTransferBatchEvent(tokenAddress, operator, senderAddress, receiverAddress, tokenIds, amounts)
            );

            // Then
            assert.fieldEquals("Nounlet", nounlet1.id, "holder", receiver.id);
            assert.fieldEquals("Nounlet", nounlet2.id, "holder", receiver.id);
            assert.fieldEquals("Nounlet", nounlet3.id, "holder", receiver.id);
            assert.fieldEquals("Nounlet", nounlet4.id, "holder", receiver.id);
            assert.fieldEquals("Nounlet", nounlet5.id, "holder", receiver.id);
            assert.fieldEquals("Account", receiver.id, "nounletsHeldCount", "5");
            assert.fieldEquals("Account", sender.id, "nounletsHeldCount", "0");
            assert.fieldEquals("Nounlet", nounlet1.id, "delegate", newDelegate.id);
            assert.fieldEquals("Nounlet", nounlet2.id, "delegate", newDelegate.id);
            assert.fieldEquals("Nounlet", nounlet3.id, "delegate", newDelegate.id);
            assert.fieldEquals("Nounlet", nounlet4.id, "delegate", newDelegate.id);
            assert.fieldEquals("Nounlet", nounlet5.id, "delegate", newDelegate.id);
            assert.fieldEquals("Delegate", newDelegate.id, "nounletsRepresentedCount", "5");
            assert.fieldEquals("Delegate", currentDelegate.id, "nounletsRepresentedCount", "0");
            assert.fieldEquals("Delegate", currentDelegate2.id, "nounletsRepresentedCount", "0");
        });

        test("Should transfer Nounlets from multiple senders to receiver", () => {});
    });
});
