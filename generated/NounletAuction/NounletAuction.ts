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

export class Bid extends ethereum.Event {
  get params(): Bid__Params {
    return new Bid__Params(this);
  }
}

export class Bid__Params {
  _event: Bid;

  constructor(event: Bid) {
    this._event = event;
  }

  get _vault(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _token(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get _id(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get _bidder(): Address {
    return this._event.parameters[3].value.toAddress();
  }

  get _value(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get _extendedTime(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }
}

export class Created extends ethereum.Event {
  get params(): Created__Params {
    return new Created__Params(this);
  }
}

export class Created__Params {
  _event: Created;

  constructor(event: Created) {
    this._event = event;
  }

  get _vault(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _token(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get _id(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get _endTime(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class Settled extends ethereum.Event {
  get params(): Settled__Params {
    return new Settled__Params(this);
  }
}

export class Settled__Params {
  _event: Settled;

  constructor(event: Settled) {
    this._event = event;
  }

  get _vault(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _token(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get _id(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get _winner(): Address {
    return this._event.parameters[3].value.toAddress();
  }

  get _amount(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class NounletAuction__auctionInfoResult {
  value0: Address;
  value1: BigInt;
  value2: BigInt;

  constructor(value0: Address, value1: BigInt, value2: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddress(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    return map;
  }

  getBidder(): Address {
    return this.value0;
  }

  getAmount(): BigInt {
    return this.value1;
  }

  getEndTime(): BigInt {
    return this.value2;
  }
}

export class NounletAuction__getPermissionsResultPermissionsStruct extends ethereum.Tuple {
  get module(): Address {
    return this[0].toAddress();
  }

  get target(): Address {
    return this[1].toAddress();
  }

  get selector(): Bytes {
    return this[2].toBytes();
  }
}

export class NounletAuction__vaultInfoResult {
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

  getCurator(): Address {
    return this.value0;
  }

  getCurrentId(): BigInt {
    return this.value1;
  }
}

export class NounletAuction extends ethereum.SmartContract {
  static bind(address: Address): NounletAuction {
    return new NounletAuction("NounletAuction", address);
  }

  DURATION(): BigInt {
    let result = super.call("DURATION", "DURATION():(uint48)", []);

    return result[0].toBigInt();
  }

  try_DURATION(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("DURATION", "DURATION():(uint48)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  MIN_INCREASE(): BigInt {
    let result = super.call("MIN_INCREASE", "MIN_INCREASE():(uint48)", []);

    return result[0].toBigInt();
  }

  try_MIN_INCREASE(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("MIN_INCREASE", "MIN_INCREASE():(uint48)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  TIME_BUFFER(): BigInt {
    let result = super.call("TIME_BUFFER", "TIME_BUFFER():(uint48)", []);

    return result[0].toBigInt();
  }

  try_TIME_BUFFER(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("TIME_BUFFER", "TIME_BUFFER():(uint48)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  TOTAL_SUPPLY(): BigInt {
    let result = super.call("TOTAL_SUPPLY", "TOTAL_SUPPLY():(uint48)", []);

    return result[0].toBigInt();
  }

  try_TOTAL_SUPPLY(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("TOTAL_SUPPLY", "TOTAL_SUPPLY():(uint48)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  auctionInfo(
    param0: Address,
    param1: BigInt
  ): NounletAuction__auctionInfoResult {
    let result = super.call(
      "auctionInfo",
      "auctionInfo(address,uint256):(address,uint64,uint32)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );

    return new NounletAuction__auctionInfoResult(
      result[0].toAddress(),
      result[1].toBigInt(),
      result[2].toBigInt()
    );
  }

  try_auctionInfo(
    param0: Address,
    param1: BigInt
  ): ethereum.CallResult<NounletAuction__auctionInfoResult> {
    let result = super.tryCall(
      "auctionInfo",
      "auctionInfo(address,uint256):(address,uint64,uint32)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new NounletAuction__auctionInfoResult(
        value[0].toAddress(),
        value[1].toBigInt(),
        value[2].toBigInt()
      )
    );
  }

  getLeafNodes(): Array<Bytes> {
    let result = super.call("getLeafNodes", "getLeafNodes():(bytes32[])", []);

    return result[0].toBytesArray();
  }

  try_getLeafNodes(): ethereum.CallResult<Array<Bytes>> {
    let result = super.tryCall(
      "getLeafNodes",
      "getLeafNodes():(bytes32[])",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytesArray());
  }

  getPermissions(): Array<
    NounletAuction__getPermissionsResultPermissionsStruct
  > {
    let result = super.call(
      "getPermissions",
      "getPermissions():((address,address,bytes4)[])",
      []
    );

    return result[0].toTupleArray<
      NounletAuction__getPermissionsResultPermissionsStruct
    >();
  }

  try_getPermissions(): ethereum.CallResult<
    Array<NounletAuction__getPermissionsResultPermissionsStruct>
  > {
    let result = super.tryCall(
      "getPermissions",
      "getPermissions():((address,address,bytes4)[])",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      value[0].toTupleArray<
        NounletAuction__getPermissionsResultPermissionsStruct
      >()
    );
  }

  onERC1155BatchReceived(
    param0: Address,
    param1: Address,
    param2: Array<BigInt>,
    param3: Array<BigInt>,
    param4: Bytes
  ): Bytes {
    let result = super.call(
      "onERC1155BatchReceived",
      "onERC1155BatchReceived(address,address,uint256[],uint256[],bytes):(bytes4)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromAddress(param1),
        ethereum.Value.fromUnsignedBigIntArray(param2),
        ethereum.Value.fromUnsignedBigIntArray(param3),
        ethereum.Value.fromBytes(param4)
      ]
    );

    return result[0].toBytes();
  }

  try_onERC1155BatchReceived(
    param0: Address,
    param1: Address,
    param2: Array<BigInt>,
    param3: Array<BigInt>,
    param4: Bytes
  ): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "onERC1155BatchReceived",
      "onERC1155BatchReceived(address,address,uint256[],uint256[],bytes):(bytes4)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromAddress(param1),
        ethereum.Value.fromUnsignedBigIntArray(param2),
        ethereum.Value.fromUnsignedBigIntArray(param3),
        ethereum.Value.fromBytes(param4)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  onERC1155Received(
    param0: Address,
    param1: Address,
    param2: BigInt,
    param3: BigInt,
    param4: Bytes
  ): Bytes {
    let result = super.call(
      "onERC1155Received",
      "onERC1155Received(address,address,uint256,uint256,bytes):(bytes4)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromAddress(param1),
        ethereum.Value.fromUnsignedBigInt(param2),
        ethereum.Value.fromUnsignedBigInt(param3),
        ethereum.Value.fromBytes(param4)
      ]
    );

    return result[0].toBytes();
  }

  try_onERC1155Received(
    param0: Address,
    param1: Address,
    param2: BigInt,
    param3: BigInt,
    param4: Bytes
  ): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "onERC1155Received",
      "onERC1155Received(address,address,uint256,uint256,bytes):(bytes4)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromAddress(param1),
        ethereum.Value.fromUnsignedBigInt(param2),
        ethereum.Value.fromUnsignedBigInt(param3),
        ethereum.Value.fromBytes(param4)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  onERC721Received(
    param0: Address,
    param1: Address,
    param2: BigInt,
    param3: Bytes
  ): Bytes {
    let result = super.call(
      "onERC721Received",
      "onERC721Received(address,address,uint256,bytes):(bytes4)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromAddress(param1),
        ethereum.Value.fromUnsignedBigInt(param2),
        ethereum.Value.fromBytes(param3)
      ]
    );

    return result[0].toBytes();
  }

  try_onERC721Received(
    param0: Address,
    param1: Address,
    param2: BigInt,
    param3: Bytes
  ): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "onERC721Received",
      "onERC721Received(address,address,uint256,bytes):(bytes4)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromAddress(param1),
        ethereum.Value.fromUnsignedBigInt(param2),
        ethereum.Value.fromBytes(param3)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  registry(): Address {
    let result = super.call("registry", "registry():(address)", []);

    return result[0].toAddress();
  }

  try_registry(): ethereum.CallResult<Address> {
    let result = super.tryCall("registry", "registry():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  supply(): Address {
    let result = super.call("supply", "supply():(address)", []);

    return result[0].toAddress();
  }

  try_supply(): ethereum.CallResult<Address> {
    let result = super.tryCall("supply", "supply():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  vaultInfo(param0: Address): NounletAuction__vaultInfoResult {
    let result = super.call(
      "vaultInfo",
      "vaultInfo(address):(address,uint96)",
      [ethereum.Value.fromAddress(param0)]
    );

    return new NounletAuction__vaultInfoResult(
      result[0].toAddress(),
      result[1].toBigInt()
    );
  }

  try_vaultInfo(
    param0: Address
  ): ethereum.CallResult<NounletAuction__vaultInfoResult> {
    let result = super.tryCall(
      "vaultInfo",
      "vaultInfo(address):(address,uint96)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new NounletAuction__vaultInfoResult(
        value[0].toAddress(),
        value[1].toBigInt()
      )
    );
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

  get _registry(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _supply(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class BidCall extends ethereum.Call {
  get inputs(): BidCall__Inputs {
    return new BidCall__Inputs(this);
  }

  get outputs(): BidCall__Outputs {
    return new BidCall__Outputs(this);
  }
}

export class BidCall__Inputs {
  _call: BidCall;

  constructor(call: BidCall) {
    this._call = call;
  }

  get _vault(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class BidCall__Outputs {
  _call: BidCall;

  constructor(call: BidCall) {
    this._call = call;
  }
}

export class CreateAuctionCall extends ethereum.Call {
  get inputs(): CreateAuctionCall__Inputs {
    return new CreateAuctionCall__Inputs(this);
  }

  get outputs(): CreateAuctionCall__Outputs {
    return new CreateAuctionCall__Outputs(this);
  }
}

export class CreateAuctionCall__Inputs {
  _call: CreateAuctionCall;

  constructor(call: CreateAuctionCall) {
    this._call = call;
  }

  get _vault(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _curator(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _mintProof(): Array<Bytes> {
    return this._call.inputValues[2].value.toBytesArray();
  }
}

export class CreateAuctionCall__Outputs {
  _call: CreateAuctionCall;

  constructor(call: CreateAuctionCall) {
    this._call = call;
  }
}

export class OnERC1155BatchReceivedCall extends ethereum.Call {
  get inputs(): OnERC1155BatchReceivedCall__Inputs {
    return new OnERC1155BatchReceivedCall__Inputs(this);
  }

  get outputs(): OnERC1155BatchReceivedCall__Outputs {
    return new OnERC1155BatchReceivedCall__Outputs(this);
  }
}

export class OnERC1155BatchReceivedCall__Inputs {
  _call: OnERC1155BatchReceivedCall;

  constructor(call: OnERC1155BatchReceivedCall) {
    this._call = call;
  }

  get value0(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get value1(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get value2(): Array<BigInt> {
    return this._call.inputValues[2].value.toBigIntArray();
  }

  get value3(): Array<BigInt> {
    return this._call.inputValues[3].value.toBigIntArray();
  }

  get value4(): Bytes {
    return this._call.inputValues[4].value.toBytes();
  }
}

export class OnERC1155BatchReceivedCall__Outputs {
  _call: OnERC1155BatchReceivedCall;

  constructor(call: OnERC1155BatchReceivedCall) {
    this._call = call;
  }

  get value0(): Bytes {
    return this._call.outputValues[0].value.toBytes();
  }
}

export class OnERC1155ReceivedCall extends ethereum.Call {
  get inputs(): OnERC1155ReceivedCall__Inputs {
    return new OnERC1155ReceivedCall__Inputs(this);
  }

  get outputs(): OnERC1155ReceivedCall__Outputs {
    return new OnERC1155ReceivedCall__Outputs(this);
  }
}

export class OnERC1155ReceivedCall__Inputs {
  _call: OnERC1155ReceivedCall;

  constructor(call: OnERC1155ReceivedCall) {
    this._call = call;
  }

  get value0(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get value1(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get value2(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get value3(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get value4(): Bytes {
    return this._call.inputValues[4].value.toBytes();
  }
}

export class OnERC1155ReceivedCall__Outputs {
  _call: OnERC1155ReceivedCall;

  constructor(call: OnERC1155ReceivedCall) {
    this._call = call;
  }

  get value0(): Bytes {
    return this._call.outputValues[0].value.toBytes();
  }
}

export class OnERC721ReceivedCall extends ethereum.Call {
  get inputs(): OnERC721ReceivedCall__Inputs {
    return new OnERC721ReceivedCall__Inputs(this);
  }

  get outputs(): OnERC721ReceivedCall__Outputs {
    return new OnERC721ReceivedCall__Outputs(this);
  }
}

export class OnERC721ReceivedCall__Inputs {
  _call: OnERC721ReceivedCall;

  constructor(call: OnERC721ReceivedCall) {
    this._call = call;
  }

  get value0(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get value1(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get value2(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get value3(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }
}

export class OnERC721ReceivedCall__Outputs {
  _call: OnERC721ReceivedCall;

  constructor(call: OnERC721ReceivedCall) {
    this._call = call;
  }

  get value0(): Bytes {
    return this._call.outputValues[0].value.toBytes();
  }
}

export class SettleAuctionCall extends ethereum.Call {
  get inputs(): SettleAuctionCall__Inputs {
    return new SettleAuctionCall__Inputs(this);
  }

  get outputs(): SettleAuctionCall__Outputs {
    return new SettleAuctionCall__Outputs(this);
  }
}

export class SettleAuctionCall__Inputs {
  _call: SettleAuctionCall;

  constructor(call: SettleAuctionCall) {
    this._call = call;
  }

  get _vault(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _mintProof(): Array<Bytes> {
    return this._call.inputValues[1].value.toBytesArray();
  }
}

export class SettleAuctionCall__Outputs {
  _call: SettleAuctionCall;

  constructor(call: SettleAuctionCall) {
    this._call = call;
  }
}

export class WithdrawNounletCall extends ethereum.Call {
  get inputs(): WithdrawNounletCall__Inputs {
    return new WithdrawNounletCall__Inputs(this);
  }

  get outputs(): WithdrawNounletCall__Outputs {
    return new WithdrawNounletCall__Outputs(this);
  }
}

export class WithdrawNounletCall__Inputs {
  _call: WithdrawNounletCall;

  constructor(call: WithdrawNounletCall) {
    this._call = call;
  }

  get _vault(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _id(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class WithdrawNounletCall__Outputs {
  _call: WithdrawNounletCall;

  constructor(call: WithdrawNounletCall) {
    this._call = call;
  }
}
