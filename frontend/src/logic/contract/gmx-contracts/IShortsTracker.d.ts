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

interface IShortsTrackerInterface extends ethers.utils.Interface {
  functions: {
    "getNextGlobalShortData(address,address,address,uint256,uint256,bool)": FunctionFragment;
    "globalShortAveragePrices(address)": FunctionFragment;
    "isGlobalShortDataReady()": FunctionFragment;
    "updateGlobalShortData(address,address,address,bool,uint256,uint256,bool)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getNextGlobalShortData",
    values: [string, string, string, BigNumberish, BigNumberish, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "globalShortAveragePrices",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "isGlobalShortDataReady",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "updateGlobalShortData",
    values: [
      string,
      string,
      string,
      boolean,
      BigNumberish,
      BigNumberish,
      boolean
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "getNextGlobalShortData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "globalShortAveragePrices",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isGlobalShortDataReady",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateGlobalShortData",
    data: BytesLike
  ): Result;

  events: {};
}

export class IShortsTracker extends BaseContract {
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

  interface: IShortsTrackerInterface;

  functions: {
    getNextGlobalShortData(
      _account: string,
      _collateralToken: string,
      _indexToken: string,
      _nextPrice: BigNumberish,
      _sizeDelta: BigNumberish,
      _isIncrease: boolean,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    globalShortAveragePrices(
      _token: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    isGlobalShortDataReady(overrides?: CallOverrides): Promise<[boolean]>;

    updateGlobalShortData(
      _account: string,
      _collateralToken: string,
      _indexToken: string,
      _isLong: boolean,
      _sizeDelta: BigNumberish,
      _markPrice: BigNumberish,
      _isIncrease: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  getNextGlobalShortData(
    _account: string,
    _collateralToken: string,
    _indexToken: string,
    _nextPrice: BigNumberish,
    _sizeDelta: BigNumberish,
    _isIncrease: boolean,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber]>;

  globalShortAveragePrices(
    _token: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  isGlobalShortDataReady(overrides?: CallOverrides): Promise<boolean>;

  updateGlobalShortData(
    _account: string,
    _collateralToken: string,
    _indexToken: string,
    _isLong: boolean,
    _sizeDelta: BigNumberish,
    _markPrice: BigNumberish,
    _isIncrease: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    getNextGlobalShortData(
      _account: string,
      _collateralToken: string,
      _indexToken: string,
      _nextPrice: BigNumberish,
      _sizeDelta: BigNumberish,
      _isIncrease: boolean,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    globalShortAveragePrices(
      _token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isGlobalShortDataReady(overrides?: CallOverrides): Promise<boolean>;

    updateGlobalShortData(
      _account: string,
      _collateralToken: string,
      _indexToken: string,
      _isLong: boolean,
      _sizeDelta: BigNumberish,
      _markPrice: BigNumberish,
      _isIncrease: boolean,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    getNextGlobalShortData(
      _account: string,
      _collateralToken: string,
      _indexToken: string,
      _nextPrice: BigNumberish,
      _sizeDelta: BigNumberish,
      _isIncrease: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    globalShortAveragePrices(
      _token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isGlobalShortDataReady(overrides?: CallOverrides): Promise<BigNumber>;

    updateGlobalShortData(
      _account: string,
      _collateralToken: string,
      _indexToken: string,
      _isLong: boolean,
      _sizeDelta: BigNumberish,
      _markPrice: BigNumberish,
      _isIncrease: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getNextGlobalShortData(
      _account: string,
      _collateralToken: string,
      _indexToken: string,
      _nextPrice: BigNumberish,
      _sizeDelta: BigNumberish,
      _isIncrease: boolean,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    globalShortAveragePrices(
      _token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isGlobalShortDataReady(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    updateGlobalShortData(
      _account: string,
      _collateralToken: string,
      _indexToken: string,
      _isLong: boolean,
      _sizeDelta: BigNumberish,
      _markPrice: BigNumberish,
      _isIncrease: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
