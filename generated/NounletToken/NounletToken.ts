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

export class ApprovalForAll extends ethereum.Event {
  get params(): ApprovalForAll__Params {
    return new ApprovalForAll__Params(this);
  }
}

export class ApprovalForAll__Params {
  _event: ApprovalForAll;

  constructor(event: ApprovalForAll) {
    this._event = event;
  }

  get owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get operator(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get approved(): boolean {
    return this._event.parameters[2].value.toBoolean();
  }
}

export class DelegateChanged extends ethereum.Event {
  get params(): DelegateChanged__Params {
    return new DelegateChanged__Params(this);
  }
}

export class DelegateChanged__Params {
  _event: DelegateChanged;

  constructor(event: DelegateChanged) {
    this._event = event;
  }

  get _delegator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _id(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get _fromDelegate(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get _toDelegate(): Address {
    return this._event.parameters[3].value.toAddress();
  }
}

export class DelegateVotesChanged extends ethereum.Event {
  get params(): DelegateVotesChanged__Params {
    return new DelegateVotesChanged__Params(this);
  }
}

export class DelegateVotesChanged__Params {
  _event: DelegateVotesChanged;

  constructor(event: DelegateVotesChanged) {
    this._event = event;
  }

  get _delegate(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _id(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get _previousBalance(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get _newBalance(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class SetRoyalty extends ethereum.Event {
  get params(): SetRoyalty__Params {
    return new SetRoyalty__Params(this);
  }
}

export class SetRoyalty__Params {
  _event: SetRoyalty;

  constructor(event: SetRoyalty) {
    this._event = event;
  }

  get _receiver(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _id(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get _percentage(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class SingleApproval extends ethereum.Event {
  get params(): SingleApproval__Params {
    return new SingleApproval__Params(this);
  }
}

export class SingleApproval__Params {
  _event: SingleApproval;

  constructor(event: SingleApproval) {
    this._event = event;
  }

  get _owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _operator(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get _id(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get _approved(): boolean {
    return this._event.parameters[3].value.toBoolean();
  }
}

export class TransferBatch extends ethereum.Event {
  get params(): TransferBatch__Params {
    return new TransferBatch__Params(this);
  }
}

export class TransferBatch__Params {
  _event: TransferBatch;

  constructor(event: TransferBatch) {
    this._event = event;
  }

  get operator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get from(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get ids(): Array<BigInt> {
    return this._event.parameters[3].value.toBigIntArray();
  }

  get amounts(): Array<BigInt> {
    return this._event.parameters[4].value.toBigIntArray();
  }
}

export class TransferSingle extends ethereum.Event {
  get params(): TransferSingle__Params {
    return new TransferSingle__Params(this);
  }
}

export class TransferSingle__Params {
  _event: TransferSingle;

  constructor(event: TransferSingle) {
    this._event = event;
  }

  get operator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get from(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get id(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get amount(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class URI extends ethereum.Event {
  get params(): URI__Params {
    return new URI__Params(this);
  }
}

export class URI__Params {
  _event: URI;

  constructor(event: URI) {
    this._event = event;
  }

  get value(): string {
    return this._event.parameters[0].value.toString();
  }

  get id(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class NounletToken__checkpointsResult {
  value0: BigInt;
  value1: BigInt;

  constructor(value0: BigInt, value1: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    return map;
  }

  getFromTimestamp(): BigInt {
    return this.value0;
  }

  getVotes(): BigInt {
    return this.value1;
  }
}

export class NounletToken__generateSeedResultValue0Struct extends ethereum.Tuple {
  get background(): BigInt {
    return this[0].toBigInt();
  }

  get body(): BigInt {
    return this[1].toBigInt();
  }

  get accessory(): BigInt {
    return this[2].toBigInt();
  }

  get head(): BigInt {
    return this[3].toBigInt();
  }

  get glasses(): BigInt {
    return this[4].toBigInt();
  }
}

export class NounletToken__royaltyInfoResult {
  value0: Address;
  value1: BigInt;

  constructor(value0: Address, value1: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddress(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    return map;
  }

  getReceiver(): Address {
    return this.value0;
  }

  getRoyaltyAmount(): BigInt {
    return this.value1;
  }
}

export class NounletToken extends ethereum.SmartContract {
  static bind(address: Address): NounletToken {
    return new NounletToken("NounletToken", address);
  }

  CONTRACT_URI(): string {
    let result = super.call("CONTRACT_URI", "CONTRACT_URI():(string)", []);

    return result[0].toString();
  }

  try_CONTRACT_URI(): ethereum.CallResult<string> {
    let result = super.tryCall("CONTRACT_URI", "CONTRACT_URI():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  DESCRIPTOR(): Address {
    let result = super.call("DESCRIPTOR", "DESCRIPTOR():(address)", []);

    return result[0].toAddress();
  }

  try_DESCRIPTOR(): ethereum.CallResult<Address> {
    let result = super.tryCall("DESCRIPTOR", "DESCRIPTOR():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  NAME(): string {
    let result = super.call("NAME", "NAME():(string)", []);

    return result[0].toString();
  }

  try_NAME(): ethereum.CallResult<string> {
    let result = super.tryCall("NAME", "NAME():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  NOUN_ID(): BigInt {
    let result = super.call("NOUN_ID", "NOUN_ID():(uint256)", []);

    return result[0].toBigInt();
  }

  try_NOUN_ID(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("NOUN_ID", "NOUN_ID():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  ROYALTY_PERCENT(): BigInt {
    let result = super.call(
      "ROYALTY_PERCENT",
      "ROYALTY_PERCENT():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_ROYALTY_PERCENT(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "ROYALTY_PERCENT",
      "ROYALTY_PERCENT():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  ROYALTY_RECEIVER(): Address {
    let result = super.call(
      "ROYALTY_RECEIVER",
      "ROYALTY_RECEIVER():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_ROYALTY_RECEIVER(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "ROYALTY_RECEIVER",
      "ROYALTY_RECEIVER():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  VAULT_REGISTRY(): Address {
    let result = super.call("VAULT_REGISTRY", "VAULT_REGISTRY():(address)", []);

    return result[0].toAddress();
  }

  try_VAULT_REGISTRY(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "VAULT_REGISTRY",
      "VAULT_REGISTRY():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  VERSION(): string {
    let result = super.call("VERSION", "VERSION():(string)", []);

    return result[0].toString();
  }

  try_VERSION(): ethereum.CallResult<string> {
    let result = super.tryCall("VERSION", "VERSION():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  balanceOf(owner: Address, id: BigInt): BigInt {
    let result = super.call(
      "balanceOf",
      "balanceOf(address,uint256):(uint256)",
      [ethereum.Value.fromAddress(owner), ethereum.Value.fromUnsignedBigInt(id)]
    );

    return result[0].toBigInt();
  }

  try_balanceOf(owner: Address, id: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "balanceOf",
      "balanceOf(address,uint256):(uint256)",
      [ethereum.Value.fromAddress(owner), ethereum.Value.fromUnsignedBigInt(id)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  balanceOfBatch(owners: Array<Address>, ids: Array<BigInt>): Array<BigInt> {
    let result = super.call(
      "balanceOfBatch",
      "balanceOfBatch(address[],uint256[]):(uint256[])",
      [
        ethereum.Value.fromAddressArray(owners),
        ethereum.Value.fromUnsignedBigIntArray(ids)
      ]
    );

    return result[0].toBigIntArray();
  }

  try_balanceOfBatch(
    owners: Array<Address>,
    ids: Array<BigInt>
  ): ethereum.CallResult<Array<BigInt>> {
    let result = super.tryCall(
      "balanceOfBatch",
      "balanceOfBatch(address[],uint256[]):(uint256[])",
      [
        ethereum.Value.fromAddressArray(owners),
        ethereum.Value.fromUnsignedBigIntArray(ids)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigIntArray());
  }

  checkpoints(
    param0: Address,
    param1: BigInt,
    param2: BigInt
  ): NounletToken__checkpointsResult {
    let result = super.call(
      "checkpoints",
      "checkpoints(address,uint256,uint256):(uint64,uint192)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1),
        ethereum.Value.fromUnsignedBigInt(param2)
      ]
    );

    return new NounletToken__checkpointsResult(
      result[0].toBigInt(),
      result[1].toBigInt()
    );
  }

  try_checkpoints(
    param0: Address,
    param1: BigInt,
    param2: BigInt
  ): ethereum.CallResult<NounletToken__checkpointsResult> {
    let result = super.tryCall(
      "checkpoints",
      "checkpoints(address,uint256,uint256):(uint64,uint192)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1),
        ethereum.Value.fromUnsignedBigInt(param2)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new NounletToken__checkpointsResult(
        value[0].toBigInt(),
        value[1].toBigInt()
      )
    );
  }

  delegates(account: Address, id: BigInt): Address {
    let result = super.call(
      "delegates",
      "delegates(address,uint256):(address)",
      [
        ethereum.Value.fromAddress(account),
        ethereum.Value.fromUnsignedBigInt(id)
      ]
    );

    return result[0].toAddress();
  }

  try_delegates(account: Address, id: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "delegates",
      "delegates(address,uint256):(address)",
      [
        ethereum.Value.fromAddress(account),
        ethereum.Value.fromUnsignedBigInt(id)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  generateSeed(tokenId: BigInt): NounletToken__generateSeedResultValue0Struct {
    let result = super.call(
      "generateSeed",
      "generateSeed(uint256):((uint48,uint48,uint48,uint48,uint48))",
      [ethereum.Value.fromUnsignedBigInt(tokenId)]
    );

    return changetype<NounletToken__generateSeedResultValue0Struct>(
      result[0].toTuple()
    );
  }

  try_generateSeed(
    tokenId: BigInt
  ): ethereum.CallResult<NounletToken__generateSeedResultValue0Struct> {
    let result = super.tryCall(
      "generateSeed",
      "generateSeed(uint256):((uint48,uint48,uint48,uint48,uint48))",
      [ethereum.Value.fromUnsignedBigInt(tokenId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      changetype<NounletToken__generateSeedResultValue0Struct>(
        value[0].toTuple()
      )
    );
  }

  getCurrentVotes(account: Address, id: BigInt): BigInt {
    let result = super.call(
      "getCurrentVotes",
      "getCurrentVotes(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(account),
        ethereum.Value.fromUnsignedBigInt(id)
      ]
    );

    return result[0].toBigInt();
  }

  try_getCurrentVotes(
    account: Address,
    id: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getCurrentVotes",
      "getCurrentVotes(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(account),
        ethereum.Value.fromUnsignedBigInt(id)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getPriorVotes(account: Address, id: BigInt, timestamp: BigInt): BigInt {
    let result = super.call(
      "getPriorVotes",
      "getPriorVotes(address,uint256,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(account),
        ethereum.Value.fromUnsignedBigInt(id),
        ethereum.Value.fromUnsignedBigInt(timestamp)
      ]
    );

    return result[0].toBigInt();
  }

  try_getPriorVotes(
    account: Address,
    id: BigInt,
    timestamp: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getPriorVotes",
      "getPriorVotes(address,uint256,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(account),
        ethereum.Value.fromUnsignedBigInt(id),
        ethereum.Value.fromUnsignedBigInt(timestamp)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  isApproved(param0: Address, param1: Address, param2: BigInt): boolean {
    let result = super.call(
      "isApproved",
      "isApproved(address,address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromAddress(param1),
        ethereum.Value.fromUnsignedBigInt(param2)
      ]
    );

    return result[0].toBoolean();
  }

  try_isApproved(
    param0: Address,
    param1: Address,
    param2: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isApproved",
      "isApproved(address,address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromAddress(param1),
        ethereum.Value.fromUnsignedBigInt(param2)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  isApprovedForAll(param0: Address, param1: Address): boolean {
    let result = super.call(
      "isApprovedForAll",
      "isApprovedForAll(address,address):(bool)",
      [ethereum.Value.fromAddress(param0), ethereum.Value.fromAddress(param1)]
    );

    return result[0].toBoolean();
  }

  try_isApprovedForAll(
    param0: Address,
    param1: Address
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isApprovedForAll",
      "isApprovedForAll(address,address):(bool)",
      [ethereum.Value.fromAddress(param0), ethereum.Value.fromAddress(param1)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  metadata(): Address {
    let result = super.call("metadata", "metadata():(address)", []);

    return result[0].toAddress();
  }

  try_metadata(): ethereum.CallResult<Address> {
    let result = super.tryCall("metadata", "metadata():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  nonces(param0: Address): BigInt {
    let result = super.call("nonces", "nonces(address):(uint256)", [
      ethereum.Value.fromAddress(param0)
    ]);

    return result[0].toBigInt();
  }

  try_nonces(param0: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall("nonces", "nonces(address):(uint256)", [
      ethereum.Value.fromAddress(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  numCheckpoints(param0: Address, param1: BigInt): BigInt {
    let result = super.call(
      "numCheckpoints",
      "numCheckpoints(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );

    return result[0].toBigInt();
  }

  try_numCheckpoints(
    param0: Address,
    param1: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "numCheckpoints",
      "numCheckpoints(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  ownerOf(param0: BigInt): Address {
    let result = super.call("ownerOf", "ownerOf(uint256):(address)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);

    return result[0].toAddress();
  }

  try_ownerOf(param0: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall("ownerOf", "ownerOf(uint256):(address)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  royaltyInfo(
    _id: BigInt,
    _salePrice: BigInt
  ): NounletToken__royaltyInfoResult {
    let result = super.call(
      "royaltyInfo",
      "royaltyInfo(uint256,uint256):(address,uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(_id),
        ethereum.Value.fromUnsignedBigInt(_salePrice)
      ]
    );

    return new NounletToken__royaltyInfoResult(
      result[0].toAddress(),
      result[1].toBigInt()
    );
  }

  try_royaltyInfo(
    _id: BigInt,
    _salePrice: BigInt
  ): ethereum.CallResult<NounletToken__royaltyInfoResult> {
    let result = super.tryCall(
      "royaltyInfo",
      "royaltyInfo(uint256,uint256):(address,uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(_id),
        ethereum.Value.fromUnsignedBigInt(_salePrice)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new NounletToken__royaltyInfoResult(
        value[0].toAddress(),
        value[1].toBigInt()
      )
    );
  }

  uri(_id: BigInt): string {
    let result = super.call("uri", "uri(uint256):(string)", [
      ethereum.Value.fromUnsignedBigInt(_id)
    ]);

    return result[0].toString();
  }

  try_uri(_id: BigInt): ethereum.CallResult<string> {
    let result = super.tryCall("uri", "uri(uint256):(string)", [
      ethereum.Value.fromUnsignedBigInt(_id)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
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

export class BatchDelegateCall extends ethereum.Call {
  get inputs(): BatchDelegateCall__Inputs {
    return new BatchDelegateCall__Inputs(this);
  }

  get outputs(): BatchDelegateCall__Outputs {
    return new BatchDelegateCall__Outputs(this);
  }
}

export class BatchDelegateCall__Inputs {
  _call: BatchDelegateCall;

  constructor(call: BatchDelegateCall) {
    this._call = call;
  }

  get account(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get ids(): Array<BigInt> {
    return this._call.inputValues[1].value.toBigIntArray();
  }
}

export class BatchDelegateCall__Outputs {
  _call: BatchDelegateCall;

  constructor(call: BatchDelegateCall) {
    this._call = call;
  }
}

export class DelegateCall extends ethereum.Call {
  get inputs(): DelegateCall__Inputs {
    return new DelegateCall__Inputs(this);
  }

  get outputs(): DelegateCall__Outputs {
    return new DelegateCall__Outputs(this);
  }
}

export class DelegateCall__Inputs {
  _call: DelegateCall;

  constructor(call: DelegateCall) {
    this._call = call;
  }

  get account(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get id(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class DelegateCall__Outputs {
  _call: DelegateCall;

  constructor(call: DelegateCall) {
    this._call = call;
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

  get _data(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }
}

export class MintCall__Outputs {
  _call: MintCall;

  constructor(call: MintCall) {
    this._call = call;
  }
}

export class PermitCall extends ethereum.Call {
  get inputs(): PermitCall__Inputs {
    return new PermitCall__Inputs(this);
  }

  get outputs(): PermitCall__Outputs {
    return new PermitCall__Outputs(this);
  }
}

export class PermitCall__Inputs {
  _call: PermitCall;

  constructor(call: PermitCall) {
    this._call = call;
  }

  get _owner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _operator(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _id(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _approved(): boolean {
    return this._call.inputValues[3].value.toBoolean();
  }

  get _deadline(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get _v(): i32 {
    return this._call.inputValues[5].value.toI32();
  }

  get _r(): Bytes {
    return this._call.inputValues[6].value.toBytes();
  }

  get _s(): Bytes {
    return this._call.inputValues[7].value.toBytes();
  }
}

export class PermitCall__Outputs {
  _call: PermitCall;

  constructor(call: PermitCall) {
    this._call = call;
  }
}

export class PermitAllCall extends ethereum.Call {
  get inputs(): PermitAllCall__Inputs {
    return new PermitAllCall__Inputs(this);
  }

  get outputs(): PermitAllCall__Outputs {
    return new PermitAllCall__Outputs(this);
  }
}

export class PermitAllCall__Inputs {
  _call: PermitAllCall;

  constructor(call: PermitAllCall) {
    this._call = call;
  }

  get _owner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _operator(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _approved(): boolean {
    return this._call.inputValues[2].value.toBoolean();
  }

  get _deadline(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get _v(): i32 {
    return this._call.inputValues[4].value.toI32();
  }

  get _r(): Bytes {
    return this._call.inputValues[5].value.toBytes();
  }

  get _s(): Bytes {
    return this._call.inputValues[6].value.toBytes();
  }
}

export class PermitAllCall__Outputs {
  _call: PermitAllCall;

  constructor(call: PermitAllCall) {
    this._call = call;
  }
}

export class SafeBatchTransferFromCall extends ethereum.Call {
  get inputs(): SafeBatchTransferFromCall__Inputs {
    return new SafeBatchTransferFromCall__Inputs(this);
  }

  get outputs(): SafeBatchTransferFromCall__Outputs {
    return new SafeBatchTransferFromCall__Outputs(this);
  }
}

export class SafeBatchTransferFromCall__Inputs {
  _call: SafeBatchTransferFromCall;

  constructor(call: SafeBatchTransferFromCall) {
    this._call = call;
  }

  get from(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get to(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get ids(): Array<BigInt> {
    return this._call.inputValues[2].value.toBigIntArray();
  }

  get amounts(): Array<BigInt> {
    return this._call.inputValues[3].value.toBigIntArray();
  }

  get data(): Bytes {
    return this._call.inputValues[4].value.toBytes();
  }
}

export class SafeBatchTransferFromCall__Outputs {
  _call: SafeBatchTransferFromCall;

  constructor(call: SafeBatchTransferFromCall) {
    this._call = call;
  }
}

export class SafeTransferFromCall extends ethereum.Call {
  get inputs(): SafeTransferFromCall__Inputs {
    return new SafeTransferFromCall__Inputs(this);
  }

  get outputs(): SafeTransferFromCall__Outputs {
    return new SafeTransferFromCall__Outputs(this);
  }
}

export class SafeTransferFromCall__Inputs {
  _call: SafeTransferFromCall;

  constructor(call: SafeTransferFromCall) {
    this._call = call;
  }

  get _from(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _to(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _id(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _amount(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get _data(): Bytes {
    return this._call.inputValues[4].value.toBytes();
  }
}

export class SafeTransferFromCall__Outputs {
  _call: SafeTransferFromCall;

  constructor(call: SafeTransferFromCall) {
    this._call = call;
  }
}

export class SetApprovalForCall extends ethereum.Call {
  get inputs(): SetApprovalForCall__Inputs {
    return new SetApprovalForCall__Inputs(this);
  }

  get outputs(): SetApprovalForCall__Outputs {
    return new SetApprovalForCall__Outputs(this);
  }
}

export class SetApprovalForCall__Inputs {
  _call: SetApprovalForCall;

  constructor(call: SetApprovalForCall) {
    this._call = call;
  }

  get _operator(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _id(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _approved(): boolean {
    return this._call.inputValues[2].value.toBoolean();
  }
}

export class SetApprovalForCall__Outputs {
  _call: SetApprovalForCall;

  constructor(call: SetApprovalForCall) {
    this._call = call;
  }
}

export class SetApprovalForAllCall extends ethereum.Call {
  get inputs(): SetApprovalForAllCall__Inputs {
    return new SetApprovalForAllCall__Inputs(this);
  }

  get outputs(): SetApprovalForAllCall__Outputs {
    return new SetApprovalForAllCall__Outputs(this);
  }
}

export class SetApprovalForAllCall__Inputs {
  _call: SetApprovalForAllCall;

  constructor(call: SetApprovalForAllCall) {
    this._call = call;
  }

  get operator(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get approved(): boolean {
    return this._call.inputValues[1].value.toBoolean();
  }
}

export class SetApprovalForAllCall__Outputs {
  _call: SetApprovalForAllCall;

  constructor(call: SetApprovalForAllCall) {
    this._call = call;
  }
}
