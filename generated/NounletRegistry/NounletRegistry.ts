// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class VaultDeployed extends ethereum.Event {
  get params(): VaultDeployed__Params {
    return new VaultDeployed__Params(this);
  }
}

export class VaultDeployed__Params {
  _event: VaultDeployed;

  constructor(event: VaultDeployed) {
    this._event = event;
  }

  get _vault(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _token(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class NounletRegistry extends ethereum.SmartContract {
  static bind(address: Address): NounletRegistry {
    return new NounletRegistry("NounletRegistry", address);
  }

  create(
    _merkleRoot: Bytes,
    _plugins: Array<Address>,
    _selectors: Array<Bytes>,
    _descriptor: Address,
    _nounId: BigInt
  ): Address {
    let result = super.call(
      "create",
      "create(bytes32,address[],bytes4[],address,uint256):(address)",
      [
        ethereum.Value.fromFixedBytes(_merkleRoot),
        ethereum.Value.fromAddressArray(_plugins),
        ethereum.Value.fromFixedBytesArray(_selectors),
        ethereum.Value.fromAddress(_descriptor),
        ethereum.Value.fromUnsignedBigInt(_nounId)
      ]
    );

    return result[0].toAddress();
  }

  try_create(
    _merkleRoot: Bytes,
    _plugins: Array<Address>,
    _selectors: Array<Bytes>,
    _descriptor: Address,
    _nounId: BigInt
  ): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "create",
      "create(bytes32,address[],bytes4[],address,uint256):(address)",
      [
        ethereum.Value.fromFixedBytes(_merkleRoot),
        ethereum.Value.fromAddressArray(_plugins),
        ethereum.Value.fromFixedBytesArray(_selectors),
        ethereum.Value.fromAddress(_descriptor),
        ethereum.Value.fromUnsignedBigInt(_nounId)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  fNFTImplementation(): Address {
    let result = super.call(
      "fNFTImplementation",
      "fNFTImplementation():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_fNFTImplementation(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "fNFTImplementation",
      "fNFTImplementation():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  factory(): Address {
    let result = super.call("factory", "factory():(address)", []);

    return result[0].toAddress();
  }

  try_factory(): ethereum.CallResult<Address> {
    let result = super.tryCall("factory", "factory():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  uri(_vault: Address, _id: BigInt): string {
    let result = super.call("uri", "uri(address,uint256):(string)", [
      ethereum.Value.fromAddress(_vault),
      ethereum.Value.fromUnsignedBigInt(_id)
    ]);

    return result[0].toString();
  }

  try_uri(_vault: Address, _id: BigInt): ethereum.CallResult<string> {
    let result = super.tryCall("uri", "uri(address,uint256):(string)", [
      ethereum.Value.fromAddress(_vault),
      ethereum.Value.fromUnsignedBigInt(_id)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  vaultToToken(param0: Address): Address {
    let result = super.call("vaultToToken", "vaultToToken(address):(address)", [
      ethereum.Value.fromAddress(param0)
    ]);

    return result[0].toAddress();
  }

  try_vaultToToken(param0: Address): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "vaultToToken",
      "vaultToToken(address):(address)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class BatchBurnCall extends ethereum.Call {
  get inputs(): BatchBurnCall__Inputs {
    return new BatchBurnCall__Inputs(this);
  }

  get outputs(): BatchBurnCall__Outputs {
    return new BatchBurnCall__Outputs(this);
  }
}

export class BatchBurnCall__Inputs {
  _call: BatchBurnCall;

  constructor(call: BatchBurnCall) {
    this._call = call;
  }

  get _from(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _ids(): Array<BigInt> {
    return this._call.inputValues[1].value.toBigIntArray();
  }
}

export class BatchBurnCall__Outputs {
  _call: BatchBurnCall;

  constructor(call: BatchBurnCall) {
    this._call = call;
  }
}

export class CreateCall extends ethereum.Call {
  get inputs(): CreateCall__Inputs {
    return new CreateCall__Inputs(this);
  }

  get outputs(): CreateCall__Outputs {
    return new CreateCall__Outputs(this);
  }
}

export class CreateCall__Inputs {
  _call: CreateCall;

  constructor(call: CreateCall) {
    this._call = call;
  }

  get _merkleRoot(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get _plugins(): Array<Address> {
    return this._call.inputValues[1].value.toAddressArray();
  }

  get _selectors(): Array<Bytes> {
    return this._call.inputValues[2].value.toBytesArray();
  }

  get _descriptor(): Address {
    return this._call.inputValues[3].value.toAddress();
  }

  get _nounId(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }
}

export class CreateCall__Outputs {
  _call: CreateCall;

  constructor(call: CreateCall) {
    this._call = call;
  }

  get vault(): Address {
    return this._call.outputValues[0].value.toAddress();
  }
}

export class MintCall extends ethereum.Call {
  get inputs(): MintCall__Inputs {
    return new MintCall__Inputs(this);
  }

  get outputs(): MintCall__Outputs {
    return new MintCall__Outputs(this);
  }
}

export class MintCall__Inputs {
  _call: MintCall;

  constructor(call: MintCall) {
    this._call = call;
  }

  get _to(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _id(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class MintCall__Outputs {
  _call: MintCall;

  constructor(call: MintCall) {
    this._call = call;
  }
}
