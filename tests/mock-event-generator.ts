import { Transfer } from "../generated/NounsToken/NounsToken";
import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { TransferBatch, TransferSingle } from "../generated/NounletToken/NounletToken";
import { AuctionBid, AuctionCreated, AuctionExtended, AuctionSettled } from "../generated/NounletAuction/NounletAuction";

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

export function generateVaultDeployedEvent(vaultId: string, tokenId: string): ethereum.Event {
    return generateMockEvent([
        new ethereum.EventParam("vaultId", ethereum.Value.fromAddress(Address.fromString(vaultId))),
        new ethereum.EventParam("tokenId", ethereum.Value.fromAddress(Address.fromString(tokenId))),
    ]);
}

export function generateTransferSingleEvent(
    operator: string,
    fromAddress: string,
    toAddress: string,
    tokenId: BigInt,
    amount: BigInt
): TransferSingle {
    return new TransferSingle(
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
            new ethereum.EventParam("operator", ethereum.Value.fromAddress(Address.fromString(operator))),
            new ethereum.EventParam("fromAddress", ethereum.Value.fromAddress(Address.fromString(fromAddress))),
            new ethereum.EventParam("toAddress", ethereum.Value.fromAddress(Address.fromString(toAddress))),
            new ethereum.EventParam("tokenId", ethereum.Value.fromUnsignedBigInt(tokenId)),
            new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount)),
        ],
        null
    );
}

export function generateTransferBatchEvent(
    operator: string,
    fromAddress: string,
    toAddress: string,
    tokenIds: BigInt[],
    amounts: BigInt[]
): TransferBatch {
    return new TransferBatch(
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
            new ethereum.EventParam("operator", ethereum.Value.fromAddress(Address.fromString(operator))),
            new ethereum.EventParam("fromAddress", ethereum.Value.fromAddress(Address.fromString(fromAddress))),
            new ethereum.EventParam("toAddress", ethereum.Value.fromAddress(Address.fromString(toAddress))),
            new ethereum.EventParam("tokenIds", ethereum.Value.fromUnsignedBigIntArray(tokenIds)),
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
): AuctionCreated {
    return new AuctionCreated(
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
            new ethereum.EventParam("_id", ethereum.Value.fromUnsignedBigInt(tokenId)),
            new ethereum.EventParam("_startTime", ethereum.Value.fromUnsignedBigInt(startTime)),
            new ethereum.EventParam("_endTime", ethereum.Value.fromUnsignedBigInt(endTime)),
        ],
        null
    );
}

export function generateAuctionExtendedEvent(
    vaultId: string,
    tokenAddress: string,
    tokenId: BigInt,
    endTime: BigInt
): AuctionExtended {
    return new AuctionExtended(
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
            new ethereum.EventParam("_endTime", ethereum.Value.fromUnsignedBigInt(endTime)),
            new ethereum.EventParam("_vault", ethereum.Value.fromAddress(Address.fromString(vaultId))),
            new ethereum.EventParam("_token", ethereum.Value.fromAddress(Address.fromString(tokenAddress))),
            new ethereum.EventParam("_id", ethereum.Value.fromUnsignedBigInt(tokenId)),
        ],
        null
    );
}

export function generateAuctionBidEvent(
    transactionId: string,
    vaultId: string,
    tokenAddress: string,
    tokenId: number,
    bidderAddress: string,
    bidAmount: number,
    extended: boolean
): AuctionBid {
    return new AuctionBid(
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
            new ethereum.EventParam("_extended", ethereum.Value.fromBoolean(extended)),
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
): AuctionSettled {
    return new AuctionSettled(
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
