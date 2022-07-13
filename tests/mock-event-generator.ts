import { Transfer } from "../generated/NounsToken/NounsToken";
import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { TransferSingle } from "../generated/NounletToken/NounletToken";

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
    tokenIds: string[],
    amounts: BigInt[]
): ethereum.Event {
    return generateMockEvent([]);
}
