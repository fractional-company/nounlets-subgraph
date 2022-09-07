import { assert, beforeEach, describe, test } from "matchstick-as/assembly";
import { clearStore } from "matchstick-as";
import { Account, Delegate, Nounlet } from "../generated/schema";
import { handleDelegateChanged, handleTransferBatch, handleTransferSingle } from "../src/nounlet-token";
import {
    generateDelegateChangedEvent,
    generateTransferBatchEvent,
    generateTransferSingleEvent,
} from "./mock-event-generator";
import { BigInt } from "@graphprotocol/graph-ts";
import {
    findOrCreateAccount,
    findOrCreateDelegate,
    findOrNewNounlet,
    generateDelegateId,
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

            holder.nounletsHeldIDs = [nounlet1.id, nounlet2.id, nounlet3.id];
            holder.save();

            // When
            handleDelegateChanged(
                generateDelegateChangedEvent(tokenAddress, delegatorAddress, oldDelegateAddress, newDelegateAddress)
            );

            // Then
            assert.fieldEquals("Nounlet", nounlet1.id, "delegate", newDelegate.id);
            assert.fieldEquals("Nounlet", nounlet2.id, "delegate", newDelegate.id);
            assert.fieldEquals("Nounlet", nounlet3.id, "delegate", newDelegate.id);
            assert.fieldEquals("Account", holder.id, "delegate", newDelegate.id);
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(newDelegate.id, nounlet1.id),
                "delegator",
                holder.id
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(newDelegate.id, nounlet1.id),
                "delegate",
                newDelegate.id
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(newDelegate.id, nounlet1.id),
                "nounlet",
                nounlet1.id
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(newDelegate.id, nounlet1.id),
                "voteAmount",
                BigInt.fromString("1").toString()
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(newDelegate.id, nounlet1.id),
                "reason",
                "Delegate Changed"
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(newDelegate.id, nounlet2.id),
                "delegator",
                holder.id
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(newDelegate.id, nounlet2.id),
                "delegate",
                newDelegate.id
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(newDelegate.id, nounlet2.id),
                "nounlet",
                nounlet2.id
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(newDelegate.id, nounlet2.id),
                "voteAmount",
                BigInt.fromString("1").toString()
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(newDelegate.id, nounlet2.id),
                "reason",
                "Delegate Changed"
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(newDelegate.id, nounlet3.id),
                "delegator",
                holder.id
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(newDelegate.id, nounlet3.id),
                "delegate",
                newDelegate.id
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(newDelegate.id, nounlet3.id),
                "nounlet",
                nounlet3.id
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(newDelegate.id, nounlet3.id),
                "voteAmount",
                BigInt.fromString("1").toString()
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(newDelegate.id, nounlet3.id),
                "reason",
                "Delegate Changed"
            );
        });

        test("Should not duplicate represented nounlet IDs when changing a Delegate", () => {
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

            holder.nounletsHeldIDs = [nounlet1.id, nounlet2.id, nounlet3.id];
            holder.save();

            // When
            handleDelegateChanged(
                generateDelegateChangedEvent(tokenAddress, delegatorAddress, oldDelegateAddress, newDelegateAddress)
            );
            handleDelegateChanged(
                generateDelegateChangedEvent(tokenAddress, delegatorAddress, oldDelegateAddress, newDelegateAddress)
            );

            // Then
            assert.fieldEquals(
                "Delegate",
                newDelegate.id,
                "nounletsRepresentedIDs",
                `[${nounlet1.id}, ${nounlet2.id}, ${nounlet3.id}]`
            );
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

            holder.nounletsHeldIDs = [nounlet1.id, nounlet2.id, nounlet3.id];
            holder.save();

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

            sender.nounletsHeldIDs = [nounlet1.id, nounlet2.id, nounlet3.id];
            sender.save();
            currentDelegate.nounletsRepresentedIDs = [nounlet1.id, nounlet2.id];
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

            receiver.nounletsHeldIDs = [nounlet4.id, nounlet5.id];
            receiver.save();
            newDelegate.nounletsRepresentedIDs = [nounlet4.id, nounlet5.id];
            newDelegate.save();

            // When
            handleTransferSingle(
                generateTransferSingleEvent(tokenAddress, operator, senderAddress, receiverAddress, tokenId, amount)
            );

            // Then
            assert.fieldEquals("Nounlet", nounlet2.id, "holder", sender.id);
            assert.fieldEquals("Nounlet", nounlet3.id, "holder", sender.id);
            assert.fieldEquals("Account", sender.id, "nounletsHeldIDs", `[${nounlet2.id}, ${nounlet3.id}]`);
            assert.fieldEquals("Nounlet", nounlet1.id, "holder", receiver.id);
            assert.fieldEquals("Nounlet", nounlet4.id, "holder", receiver.id);
            assert.fieldEquals("Nounlet", nounlet5.id, "holder", receiver.id);
            assert.fieldEquals(
                "Account",
                receiver.id,
                "nounletsHeldIDs",
                `[${nounlet4.id}, ${nounlet5.id}, ${nounlet1.id}]`
            );
            assert.fieldEquals("Nounlet", nounlet2.id, "delegate", currentDelegate.id);
            assert.fieldEquals("Delegate", currentDelegate.id, "nounletsRepresentedIDs", `[${nounlet2.id}]`);
            assert.fieldEquals("Nounlet", nounlet1.id, "delegate", newDelegate.id);
            assert.fieldEquals("Nounlet", nounlet4.id, "delegate", newDelegate.id);
            assert.fieldEquals("Nounlet", nounlet5.id, "delegate", newDelegate.id);
            assert.fieldEquals(
                "Delegate",
                newDelegate.id,
                "nounletsRepresentedIDs",
                `[${nounlet4.id}, ${nounlet5.id}, ${nounlet1.id}]`
            );
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

            sender.nounletsHeldIDs = [nounlet1.id, nounlet2.id, nounlet3.id];
            sender.save();
            currentDelegate.nounletsRepresentedIDs = [nounlet1.id, nounlet2.id];
            currentDelegate.save();
            currentDelegate2.nounletsRepresentedIDs = [nounlet3.id];
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

            receiver.nounletsHeldIDs = [nounlet4.id, nounlet5.id];
            receiver.save();
            newDelegate.nounletsRepresentedIDs = [nounlet4.id, nounlet5.id];
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
            assert.fieldEquals(
                "Account",
                receiver.id,
                "nounletsHeldIDs",
                `[${nounlet4.id}, ${nounlet5.id}, ${nounlet1.id}, ${nounlet2.id}, ${nounlet3.id}]`
            );
            assert.fieldEquals("Account", sender.id, "nounletsHeldIDs", "[]");
            assert.fieldEquals("Nounlet", nounlet1.id, "delegate", newDelegate.id);
            assert.fieldEquals("Nounlet", nounlet2.id, "delegate", newDelegate.id);
            assert.fieldEquals("Nounlet", nounlet3.id, "delegate", newDelegate.id);
            assert.fieldEquals("Nounlet", nounlet4.id, "delegate", newDelegate.id);
            assert.fieldEquals("Nounlet", nounlet5.id, "delegate", newDelegate.id);
            assert.fieldEquals(
                "Delegate",
                newDelegate.id,
                "nounletsRepresentedIDs",
                `[${nounlet4.id}, ${nounlet5.id}, ${nounlet1.id}, ${nounlet2.id}, ${nounlet3.id}]`
            );
            assert.fieldEquals("Delegate", currentDelegate.id, "nounletsRepresentedIDs", "[]");
            assert.fieldEquals("Delegate", currentDelegate2.id, "nounletsRepresentedIDs", "[]");
        });

        test("Should delegate transferred Nounlets to the current Delegate of a new Nounlet holder", () => {
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

            sender.nounletsHeldIDs = [nounlet1.id, nounlet2.id, nounlet3.id];
            sender.save();
            currentDelegate.nounletsRepresentedIDs = [nounlet1.id, nounlet2.id];
            currentDelegate.save();
            currentDelegate2.nounletsRepresentedIDs = [nounlet3.id];
            currentDelegate2.save();

            const receiver = findOrCreateAccount(receiverAddress, tokenAddress);
            const receiverDelegate = findOrCreateDelegate(
                "0x397C2BEcA050527b843fF6032c7870A2cF487C37".toLowerCase(),
                tokenAddress
            );
            receiver.delegate = receiverDelegate.id;
            receiver.save();

            // When
            handleTransferBatch(
                generateTransferBatchEvent(tokenAddress, operator, senderAddress, receiverAddress, tokenIds, amounts)
            );

            // Then
            assert.fieldEquals("Account", receiver.id, "delegate", receiverDelegate.id);
            assert.fieldEquals("Nounlet", nounlet1.id, "delegate", receiverDelegate.id);
            assert.fieldEquals("Nounlet", nounlet2.id, "delegate", receiverDelegate.id);
            assert.fieldEquals("Nounlet", nounlet3.id, "delegate", receiverDelegate.id);
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegate.id, nounlet1.id),
                "delegator",
                receiver.id
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegate.id, nounlet1.id),
                "delegate",
                receiverDelegate.id
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegate.id, nounlet1.id),
                "nounlet",
                nounlet1.id
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegate.id, nounlet1.id),
                "voteAmount",
                BigInt.fromString("1").toString()
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegate.id, nounlet1.id),
                "reason",
                "Nounlet Transferred"
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegate.id, nounlet2.id),
                "delegator",
                receiver.id
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegate.id, nounlet2.id),
                "delegate",
                receiverDelegate.id
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegate.id, nounlet2.id),
                "nounlet",
                nounlet2.id
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegate.id, nounlet2.id),
                "voteAmount",
                BigInt.fromString("1").toString()
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegate.id, nounlet2.id),
                "reason",
                "Nounlet Transferred"
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegate.id, nounlet3.id),
                "delegator",
                receiver.id
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegate.id, nounlet3.id),
                "delegate",
                receiverDelegate.id
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegate.id, nounlet3.id),
                "nounlet",
                nounlet3.id
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegate.id, nounlet3.id),
                "voteAmount",
                BigInt.fromString("1").toString()
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegate.id, nounlet3.id),
                "reason",
                "Nounlet Transferred"
            );
        });

        test("Should delegate transferred Nounlets to themselves if a new Nounlet holder did not delegate his Nounlets", () => {
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

            sender.nounletsHeldIDs = [nounlet1.id, nounlet2.id, nounlet3.id];
            sender.save();
            currentDelegate.nounletsRepresentedIDs = [nounlet1.id, nounlet2.id];
            currentDelegate.save();
            currentDelegate2.nounletsRepresentedIDs = [nounlet3.id];
            currentDelegate2.save();

            const receiver = findOrCreateAccount(receiverAddress, tokenAddress);

            // When
            handleTransferBatch(
                generateTransferBatchEvent(tokenAddress, operator, senderAddress, receiverAddress, tokenIds, amounts)
            );

            // Then
            const receiverDelegateId = generateDelegateId(receiverAddress, tokenAddress);
            assert.fieldEquals("Account", receiver.id, "delegate", receiverDelegateId);
            assert.fieldEquals("Nounlet", nounlet1.id, "delegate", receiverDelegateId);
            assert.fieldEquals("Nounlet", nounlet2.id, "delegate", receiverDelegateId);
            assert.fieldEquals("Nounlet", nounlet3.id, "delegate", receiverDelegateId);
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegateId, nounlet1.id),
                "delegator",
                receiver.id
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegateId, nounlet1.id),
                "delegate",
                receiverDelegateId
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegateId, nounlet1.id),
                "nounlet",
                nounlet1.id
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegateId, nounlet1.id),
                "voteAmount",
                BigInt.fromString("1").toString()
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegateId, nounlet1.id),
                "reason",
                "Nounlet Transferred"
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegateId, nounlet2.id),
                "delegator",
                receiver.id
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegateId, nounlet2.id),
                "delegate",
                receiverDelegateId
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegateId, nounlet2.id),
                "nounlet",
                nounlet2.id
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegateId, nounlet2.id),
                "voteAmount",
                BigInt.fromString("1").toString()
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegateId, nounlet2.id),
                "reason",
                "Nounlet Transferred"
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegateId, nounlet3.id),
                "delegator",
                receiver.id
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegateId, nounlet3.id),
                "delegate",
                receiverDelegateId
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegateId, nounlet3.id),
                "nounlet",
                nounlet3.id
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegateId, nounlet3.id),
                "voteAmount",
                BigInt.fromString("1").toString()
            );
            assert.fieldEquals(
                "DelegateVote",
                generateDelegateVoteId(receiverDelegateId, nounlet3.id),
                "reason",
                "Nounlet Transferred"
            );
        });
    });
});
