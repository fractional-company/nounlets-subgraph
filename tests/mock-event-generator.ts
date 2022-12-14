import { Approval, Transfer } from "../generated/NounsToken/NounsToken";
import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import {
    DelegateChanged,
    DelegateVotesChanged,
    TransferBatch,
    TransferSingle,
} from "../generated/templates/NounletToken/NounletToken";
import { Bid, Created, Settled } from "../generated/NounletAuction/NounletAuction";
import { VaultDeployed } from "../generated/NounletRegistry/NounletRegistry";
import { ClaimDelegate } from "../generated/NounletGovernance/NounletGovernance";

const generateMockEvent = (parameters: ethereum.EventParam[] = []): ethereum.Event => {
    return new ethereum.Event(
        new Address(10),
        new BigInt(20),
        new BigInt(10),
        null,
        new ethereum.Block(
            new Bytes(1),
            new Bytes(1),
            new Bytes(1),
            new Address(1),
            new Bytes(1),
            new Bytes(1),
            new Bytes(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1)
        ),
        new ethereum.Transaction(
            new Bytes(1),
            new BigInt(1),
            new Address(123456),
            null,
            new BigInt(10),
            new BigInt(20),
            new BigInt(2),
            new Bytes(1),
            new BigInt(1000)
        ),
        parameters,
        null
    );
};

export function generateTransferEvent(fromAddress: string, toAddress: string, tokenId: string): Transfer {
    return new Transfer(
        new Address(10),
        new BigInt(20),
        new BigInt(10),
        null,
        new ethereum.Block(
            new Bytes(1),
            new Bytes(1),
            new Bytes(1),
            new Address(1),
            new Bytes(1),
            new Bytes(1),
            new Bytes(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1)
        ),
        new ethereum.Transaction(
            new Bytes(1),
            new BigInt(1),
            new Address(123456),
            null,
            new BigInt(10),
            new BigInt(20),
            new BigInt(2),
            new Bytes(1),
            new BigInt(1000)
        ),
        [
            new ethereum.EventParam("fromAddress", ethereum.Value.fromAddress(Address.fromString(fromAddress))),
            new ethereum.EventParam("toAddress", ethereum.Value.fromAddress(Address.fromString(toAddress))),
            new ethereum.EventParam("tokenId", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(tokenId))),
        ],
        null
    );
}

export function generateTransferSingleEvent(
    tokenAddress: string,
    operator: string,
    fromAddress: string,
    toAddress: string,
    tokenId: BigInt,
    amount: BigInt
): TransferSingle {
    return new TransferSingle(
        Address.fromString(tokenAddress),
        new BigInt(20),
        new BigInt(10),
        null,
        new ethereum.Block(
            new Bytes(1),
            new Bytes(1),
            new Bytes(1),
            new Address(1),
            new Bytes(1),
            new Bytes(1),
            new Bytes(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1)
        ),
        new ethereum.Transaction(
            new Bytes(1),
            new BigInt(1),
            new Address(123456),
            null,
            new BigInt(10),
            new BigInt(20),
            new BigInt(2),
            new Bytes(1),
            new BigInt(1000)
        ),
        [
            new ethereum.EventParam("operator", ethereum.Value.fromAddress(Address.fromString(operator))),
            new ethereum.EventParam("from", ethereum.Value.fromAddress(Address.fromString(fromAddress))),
            new ethereum.EventParam("to", ethereum.Value.fromAddress(Address.fromString(toAddress))),
            new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(tokenId)),
            new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount)),
        ],
        null
    );
}

export function generateTransferBatchEvent(
    tokenAddress: string,
    operator: string,
    fromAddress: string,
    toAddress: string,
    tokenIds: BigInt[],
    amounts: BigInt[]
): TransferBatch {
    return new TransferBatch(
        Address.fromString(tokenAddress),
        new BigInt(20),
        new BigInt(10),
        null,
        new ethereum.Block(
            new Bytes(1),
            new Bytes(1),
            new Bytes(1),
            new Address(1),
            new Bytes(1),
            new Bytes(1),
            new Bytes(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1)
        ),
        new ethereum.Transaction(
            new Bytes(1),
            new BigInt(1),
            new Address(123456),
            null,
            new BigInt(10),
            new BigInt(20),
            new BigInt(2),
            new Bytes(1),
            new BigInt(1000)
        ),
        [
            new ethereum.EventParam("operator", ethereum.Value.fromAddress(Address.fromString(operator))),
            new ethereum.EventParam("from", ethereum.Value.fromAddress(Address.fromString(fromAddress))),
            new ethereum.EventParam("to", ethereum.Value.fromAddress(Address.fromString(toAddress))),
            new ethereum.EventParam("ids", ethereum.Value.fromUnsignedBigIntArray(tokenIds)),
            new ethereum.EventParam("amounts", ethereum.Value.fromUnsignedBigIntArray(amounts)),
        ],
        null
    );
}

export function generateAuctionCreatedEvent(
    vaultId: string,
    tokenAddress: string,
    tokenId: BigInt,
    startTime: BigInt,
    endTime: BigInt
): Created {
    return new Created(
        new Address(10),
        new BigInt(20),
        new BigInt(10),
        null,
        new ethereum.Block(
            new Bytes(1),
            new Bytes(1),
            new Bytes(1),
            new Address(1),
            new Bytes(1),
            new Bytes(1),
            new Bytes(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            startTime,
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1)
        ),
        new ethereum.Transaction(
            new Bytes(1),
            new BigInt(1),
            new Address(123456),
            null,
            new BigInt(10),
            new BigInt(20),
            new BigInt(2),
            new Bytes(1),
            new BigInt(1000)
        ),
        [
            new ethereum.EventParam("_vault", ethereum.Value.fromAddress(Address.fromString(vaultId))),
            new ethereum.EventParam("_token", ethereum.Value.fromAddress(Address.fromString(tokenAddress))),
            new ethereum.EventParam("_id", ethereum.Value.fromUnsignedBigInt(tokenId)),
            new ethereum.EventParam("_endTime", ethereum.Value.fromUnsignedBigInt(endTime)),
        ],
        null
    );
}

// export function generateAuctionExtendedEvent(
//     vaultId: string,
//     tokenAddress: string,
//     tokenId: BigInt,
//     endTime: BigInt
// ): AuctionExtended {
//     return new AuctionExtended(
//         new Address(10),
//         new BigInt(20),
//         new BigInt(10),
//         null,
//         new ethereum.Block(
//             new Bytes(1),
//             new Bytes(1),
//             new Bytes(1),
//             new Address(1),
//             new Bytes(1),
//             new Bytes(1),
//             new Bytes(1),
//             new BigInt(1),
//             new BigInt(1),
//             new BigInt(1),
//             new BigInt(1),
//             new BigInt(1),
//             new BigInt(1),
//             new BigInt(1),
//             new BigInt(1)
//         ),
//         new ethereum.Transaction(
//             new Bytes(1),
//             new BigInt(1),
//             new Address(123456),
//             null,
//             new BigInt(10),
//             new BigInt(20),
//             new BigInt(2),
//             new Bytes(1),
//             new BigInt(1000)
//         ),
//         [
//             new ethereum.EventParam("_endTime", ethereum.Value.fromUnsignedBigInt(endTime)),
//             new ethereum.EventParam("_vault", ethereum.Value.fromAddress(Address.fromString(vaultId))),
//             new ethereum.EventParam("_token", ethereum.Value.fromAddress(Address.fromString(tokenAddress))),
//             new ethereum.EventParam("_id", ethereum.Value.fromUnsignedBigInt(tokenId)),
//         ],
//         null
//     );
// }

export function generateAuctionBidEvent(
    transactionId: string,
    vaultId: string,
    tokenAddress: string,
    tokenId: number,
    bidderAddress: string,
    bidAmount: number,
    extendedTime: number
): Bid {
    return new Bid(
        new Address(10),
        new BigInt(20),
        new BigInt(10),
        null,
        new ethereum.Block(
            new Bytes(1),
            new Bytes(1),
            new Bytes(1),
            new Address(1),
            new Bytes(1),
            new Bytes(1),
            new Bytes(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1)
        ),
        new ethereum.Transaction(
            Bytes.fromHexString(transactionId),
            new BigInt(1),
            new Address(123456),
            null,
            new BigInt(10),
            new BigInt(20),
            new BigInt(2),
            new Bytes(1),
            new BigInt(1000)
        ),
        [
            new ethereum.EventParam("_vault", ethereum.Value.fromAddress(Address.fromString(vaultId))),
            new ethereum.EventParam("_token", ethereum.Value.fromAddress(Address.fromString(tokenAddress))),
            new ethereum.EventParam("_id", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(tokenId as i32))),
            new ethereum.EventParam("_sender", ethereum.Value.fromAddress(Address.fromString(bidderAddress))),
            new ethereum.EventParam("_value", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(bidAmount as i32))),
            new ethereum.EventParam(
                "_extendedTime",
                ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(extendedTime as i32))
            ),
        ],
        null
    );
}

export function generateAuctionSettledEvent(
    vaultId: string,
    tokenAddress: string,
    tokenId: number,
    winnerAddress: string,
    winningAmount: number
): Settled {
    return new Settled(
        new Address(10),
        new BigInt(20),
        new BigInt(10),
        null,
        new ethereum.Block(
            new Bytes(1),
            new Bytes(1),
            new Bytes(1),
            new Address(1),
            new Bytes(1),
            new Bytes(1),
            new Bytes(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1)
        ),
        new ethereum.Transaction(
            new Bytes(1),
            new BigInt(1),
            new Address(123456),
            null,
            new BigInt(10),
            new BigInt(20),
            new BigInt(2),
            new Bytes(1),
            new BigInt(1000)
        ),
        [
            new ethereum.EventParam("_vault", ethereum.Value.fromAddress(Address.fromString(vaultId))),
            new ethereum.EventParam("_token", ethereum.Value.fromAddress(Address.fromString(tokenAddress))),
            new ethereum.EventParam("_id", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(tokenId as i32))),
            new ethereum.EventParam("_sender", ethereum.Value.fromAddress(Address.fromString(winnerAddress))),
            new ethereum.EventParam("_amount", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(winningAmount as i32))),
        ],
        null
    );
}

export function generateDelegateVotesChangedEvent(
    delegateId: string,
    nounId: number,
    previousBalance: number,
    newBalance: number
): DelegateVotesChanged {
    return new DelegateVotesChanged(
        new Address(10),
        new BigInt(20),
        new BigInt(10),
        null,
        new ethereum.Block(
            new Bytes(1),
            new Bytes(1),
            new Bytes(1),
            new Address(1),
            new Bytes(1),
            new Bytes(1),
            new Bytes(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(100000),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1)
        ),
        new ethereum.Transaction(
            new Bytes(1),
            new BigInt(1),
            new Address(123456),
            null,
            new BigInt(10),
            new BigInt(20),
            new BigInt(2),
            new Bytes(1),
            new BigInt(1000)
        ),
        [
            new ethereum.EventParam("_delegate", ethereum.Value.fromAddress(Address.fromString(delegateId))),
            new ethereum.EventParam("_id", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(nounId as i32))),
            new ethereum.EventParam(
                "_previousBalance",
                ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(previousBalance as i32))
            ),
            new ethereum.EventParam("_newBalance", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(newBalance as i32))),
        ],
        null
    );
}

export function generateDelegateChangedEvent(
    tokenAddress: string,
    delegatorId: string,
    fromDelegateId: string,
    toDelegateId: string
): DelegateChanged {
    return new DelegateChanged(
        Address.fromString(tokenAddress),
        new BigInt(20),
        new BigInt(10),
        null,
        new ethereum.Block(
            new Bytes(1),
            new Bytes(1),
            new Bytes(1),
            new Address(1),
            new Bytes(1),
            new Bytes(1),
            new Bytes(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1)
        ),
        new ethereum.Transaction(
            new Bytes(1),
            new BigInt(1),
            new Address(123456),
            null,
            new BigInt(10),
            new BigInt(20),
            new BigInt(2),
            new Bytes(1),
            new BigInt(1000)
        ),
        [
            new ethereum.EventParam("_delegator", ethereum.Value.fromAddress(Address.fromString(delegatorId))),
            new ethereum.EventParam("_fromDelegate", ethereum.Value.fromAddress(Address.fromString(fromDelegateId))),
            new ethereum.EventParam("_toDelegate", ethereum.Value.fromAddress(Address.fromString(toDelegateId))),
        ],
        null
    );
}

export function generateVaultDeployedEvent(vaultId: string, nounAddress: string, nounId: number): VaultDeployed {
    return new VaultDeployed(
        new Address(10),
        new BigInt(20),
        new BigInt(10),
        null,
        new ethereum.Block(
            new Bytes(1),
            new Bytes(1),
            new Bytes(1),
            new Address(1),
            new Bytes(1),
            new Bytes(1),
            new Bytes(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1)
        ),
        new ethereum.Transaction(
            new Bytes(1),
            new BigInt(1),
            new Address(123456),
            null,
            new BigInt(10),
            new BigInt(20),
            new BigInt(2),
            new Bytes(1),
            new BigInt(1000)
        ),
        [
            new ethereum.EventParam("_vault", ethereum.Value.fromAddress(Address.fromString(vaultId))),
            new ethereum.EventParam("_token", ethereum.Value.fromAddress(Address.fromString(nounAddress))),
            new ethereum.EventParam("_id", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(nounId as i32))),
        ],
        null
    );
}

export function generateClaimDelegateEvent(
    vaultId: string,
    previousDelegate: string,
    newDelegate: string
): ClaimDelegate {
    return new ClaimDelegate(
        new Address(10),
        new BigInt(20),
        new BigInt(10),
        null,
        new ethereum.Block(
            new Bytes(1),
            new Bytes(1),
            new Bytes(1),
            new Address(1),
            new Bytes(1),
            new Bytes(1),
            new Bytes(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1)
        ),
        new ethereum.Transaction(
            new Bytes(1),
            new BigInt(1),
            new Address(123456),
            null,
            new BigInt(10),
            new BigInt(20),
            new BigInt(2),
            new Bytes(1),
            new BigInt(1000)
        ),
        [
            new ethereum.EventParam("_vault", ethereum.Value.fromAddress(Address.fromString(vaultId))),
            new ethereum.EventParam("_newDelegate", ethereum.Value.fromAddress(Address.fromString(newDelegate))),
            new ethereum.EventParam(
                "_previousDelegate",
                ethereum.Value.fromAddress(Address.fromString(previousDelegate))
            ),
        ],
        null
    );
}

export function generateApprovalEvent(owner: string, approvedContractAddress: string, tokenId: number): Approval {
    return new Approval(
        new Address(10),
        new BigInt(20),
        new BigInt(10),
        null,
        new ethereum.Block(
            new Bytes(1),
            new Bytes(1),
            new Bytes(1),
            new Address(1),
            new Bytes(1),
            new Bytes(1),
            new Bytes(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1),
            new BigInt(1)
        ),
        new ethereum.Transaction(
            new Bytes(1),
            new BigInt(1),
            new Address(123456),
            null,
            new BigInt(10),
            new BigInt(20),
            new BigInt(2),
            new Bytes(1),
            new BigInt(1000)
        ),
        [
            new ethereum.EventParam("owner", ethereum.Value.fromAddress(Address.fromString(owner))),
            new ethereum.EventParam("approved", ethereum.Value.fromAddress(Address.fromString(approvedContractAddress))),
            new ethereum.EventParam("tokenId", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(tokenId as i32))),
        ],
        null
    );
}
