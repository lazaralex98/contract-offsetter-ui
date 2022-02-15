/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface ContractOffsetterInterface extends ethers.utils.Interface {
  functions: {
    "balances(address,address)": FunctionFragment;
    "bctAddress()": FunctionFragment;
    "contractRegistry()": FunctionFragment;
    "deposit(address,uint256)": FunctionFragment;
    "lastOffsetNonce(address)": FunctionFragment;
    "offset(address,uint256,address,uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "redeemBCT(address,uint256)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setToucanContractRegistry(address)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "balances",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "bctAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "contractRegistry",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "lastOffsetNonce",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "offset",
    values: [string, BigNumberish, string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "redeemBCT",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setToucanContractRegistry",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(functionFragment: "balances", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "bctAddress", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "contractRegistry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "lastOffsetNonce",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "offset", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "redeemBCT", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setToucanContractRegistry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "Deposited(address,address,uint256)": EventFragment;
    "Offset(address,address,uint256,address,uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "Redeemed(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Deposited"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Offset"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Redeemed"): EventFragment;
}

export type DepositedEvent = TypedEvent<
  [string, string, BigNumber] & {
    depositor: string;
    erc20Address: string;
    amountDeposited: BigNumber;
  }
>;

export type OffsetEvent = TypedEvent<
  [string, string, BigNumber, string, BigNumber] & {
    offsetter: string;
    retiredTCO2: string;
    amountOffset: BigNumber;
    offsetAddress: string;
    latestOffsetNonce: BigNumber;
  }
>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string] & { previousOwner: string; newOwner: string }
>;

export type RedeemedEvent = TypedEvent<
  [string, string, BigNumber] & {
    redeemer: string;
    receivedTCO2: string;
    amountRedeemed: BigNumber;
  }
>;

export class ContractOffsetter extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: ContractOffsetterInterface;

  functions: {
    balances(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    bctAddress(overrides?: CallOverrides): Promise<[string]>;

    contractRegistry(overrides?: CallOverrides): Promise<[string]>;

    deposit(
      _erc20Address: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    lastOffsetNonce(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    offset(
      _tco2Address: string,
      _amount: BigNumberish,
      _offsetAddress: string,
      _nonce: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    redeemBCT(
      _desiredTCO2: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setToucanContractRegistry(
      _address: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  balances(
    arg0: string,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  bctAddress(overrides?: CallOverrides): Promise<string>;

  contractRegistry(overrides?: CallOverrides): Promise<string>;

  deposit(
    _erc20Address: string,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  lastOffsetNonce(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  offset(
    _tco2Address: string,
    _amount: BigNumberish,
    _offsetAddress: string,
    _nonce: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  redeemBCT(
    _desiredTCO2: string,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setToucanContractRegistry(
    _address: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    balances(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    bctAddress(overrides?: CallOverrides): Promise<string>;

    contractRegistry(overrides?: CallOverrides): Promise<string>;

    deposit(
      _erc20Address: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    lastOffsetNonce(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    offset(
      _tco2Address: string,
      _amount: BigNumberish,
      _offsetAddress: string,
      _nonce: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    redeemBCT(
      _desiredTCO2: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setToucanContractRegistry(
      _address: string,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "Deposited(address,address,uint256)"(
      depositor?: null,
      erc20Address?: null,
      amountDeposited?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { depositor: string; erc20Address: string; amountDeposited: BigNumber }
    >;

    Deposited(
      depositor?: null,
      erc20Address?: null,
      amountDeposited?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { depositor: string; erc20Address: string; amountDeposited: BigNumber }
    >;

    "Offset(address,address,uint256,address,uint256)"(
      offsetter?: null,
      retiredTCO2?: null,
      amountOffset?: null,
      offsetAddress?: null,
      latestOffsetNonce?: null
    ): TypedEventFilter<
      [string, string, BigNumber, string, BigNumber],
      {
        offsetter: string;
        retiredTCO2: string;
        amountOffset: BigNumber;
        offsetAddress: string;
        latestOffsetNonce: BigNumber;
      }
    >;

    Offset(
      offsetter?: null,
      retiredTCO2?: null,
      amountOffset?: null,
      offsetAddress?: null,
      latestOffsetNonce?: null
    ): TypedEventFilter<
      [string, string, BigNumber, string, BigNumber],
      {
        offsetter: string;
        retiredTCO2: string;
        amountOffset: BigNumber;
        offsetAddress: string;
        latestOffsetNonce: BigNumber;
      }
    >;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    "Redeemed(address,address,uint256)"(
      redeemer?: null,
      receivedTCO2?: null,
      amountRedeemed?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { redeemer: string; receivedTCO2: string; amountRedeemed: BigNumber }
    >;

    Redeemed(
      redeemer?: null,
      receivedTCO2?: null,
      amountRedeemed?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { redeemer: string; receivedTCO2: string; amountRedeemed: BigNumber }
    >;
  };

  estimateGas: {
    balances(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    bctAddress(overrides?: CallOverrides): Promise<BigNumber>;

    contractRegistry(overrides?: CallOverrides): Promise<BigNumber>;

    deposit(
      _erc20Address: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    lastOffsetNonce(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    offset(
      _tco2Address: string,
      _amount: BigNumberish,
      _offsetAddress: string,
      _nonce: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    redeemBCT(
      _desiredTCO2: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setToucanContractRegistry(
      _address: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    balances(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    bctAddress(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    contractRegistry(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    deposit(
      _erc20Address: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    lastOffsetNonce(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    offset(
      _tco2Address: string,
      _amount: BigNumberish,
      _offsetAddress: string,
      _nonce: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    redeemBCT(
      _desiredTCO2: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setToucanContractRegistry(
      _address: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
