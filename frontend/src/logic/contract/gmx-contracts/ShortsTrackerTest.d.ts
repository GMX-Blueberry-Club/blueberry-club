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

interface ShortsTrackerTestInterface extends ethers.utils.Interface {
  functions: {
    "MAX_INT256()": FunctionFragment;
    "_getNextGlobalAveragePrice(uint256,uint256,uint256,uint256,int256)": FunctionFragment;
    "data(bytes32)": FunctionFragment;
    "getGlobalShortDelta(address)": FunctionFragment;
    "getNextGlobalShortData(address,address,address,uint256,uint256,bool)": FunctionFragment;
    "getNextGlobalShortDataWithRealisedPnl(address,uint256,uint256,int256,bool)": FunctionFragment;
    "getRealisedPnl(address,address,address,uint256,bool)": FunctionFragment;
    "globalShortAveragePrices(address)": FunctionFragment;
    "gov()": FunctionFragment;
    "isGlobalShortDataReady()": FunctionFragment;
    "isHandler(address)": FunctionFragment;
    "setGlobalShortAveragePrice(address,uint256)": FunctionFragment;
    "setGov(address)": FunctionFragment;
    "setHandler(address,bool)": FunctionFragment;
    "setInitData(address[],uint256[])": FunctionFragment;
    "setIsGlobalShortDataReady(bool)": FunctionFragment;
    "updateGlobalShortData(address,address,address,bool,uint256,uint256,bool)": FunctionFragment;
    "vault()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "MAX_INT256",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "_getNextGlobalAveragePrice",
    values: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(functionFragment: "data", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "getGlobalShortDelta",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getNextGlobalShortData",
    values: [string, string, string, BigNumberish, BigNumberish, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "getNextGlobalShortDataWithRealisedPnl",
    values: [string, BigNumberish, BigNumberish, BigNumberish, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "getRealisedPnl",
    values: [string, string, string, BigNumberish, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "globalShortAveragePrices",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "gov", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "isGlobalShortDataReady",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "isHandler", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setGlobalShortAveragePrice",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "setGov", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setHandler",
    values: [string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setInitData",
    values: [string[], BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "setIsGlobalShortDataReady",
    values: [boolean]
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
  encodeFunctionData(functionFragment: "vault", values?: undefined): string;

  decodeFunctionResult(functionFragment: "MAX_INT256", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "_getNextGlobalAveragePrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "data", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getGlobalShortDelta",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getNextGlobalShortData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getNextGlobalShortDataWithRealisedPnl",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRealisedPnl",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "globalShortAveragePrices",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "gov", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isGlobalShortDataReady",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isHandler", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setGlobalShortAveragePrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setGov", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setHandler", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setInitData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setIsGlobalShortDataReady",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateGlobalShortData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "vault", data: BytesLike): Result;

  events: {
    "GlobalShortDataUpdated(address,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "GlobalShortDataUpdated"): EventFragment;
}

export type GlobalShortDataUpdatedEvent = TypedEvent<
  [string, BigNumber, BigNumber] & {
    token: string;
    globalShortSize: BigNumber;
    globalShortAveragePrice: BigNumber;
  }
>;

export class ShortsTrackerTest extends BaseContract {
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

  interface: ShortsTrackerTestInterface;

  functions: {
    MAX_INT256(overrides?: CallOverrides): Promise<[BigNumber]>;

    _getNextGlobalAveragePrice(
      _averagePrice: BigNumberish,
      _nextPrice: BigNumberish,
      _nextSize: BigNumberish,
      _delta: BigNumberish,
      _realisedPnl: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    data(arg0: BytesLike, overrides?: CallOverrides): Promise<[string]>;

    getGlobalShortDelta(
      _token: string,
      overrides?: CallOverrides
    ): Promise<[boolean, BigNumber]>;

    getNextGlobalShortData(
      _account: string,
      _collateralToken: string,
      _indexToken: string,
      _nextPrice: BigNumberish,
      _sizeDelta: BigNumberish,
      _isIncrease: boolean,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    getNextGlobalShortDataWithRealisedPnl(
      _indexToken: string,
      _nextPrice: BigNumberish,
      _sizeDelta: BigNumberish,
      _realisedPnl: BigNumberish,
      _isIncrease: boolean,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    getRealisedPnl(
      _account: string,
      _collateralToken: string,
      _indexToken: string,
      _sizeDelta: BigNumberish,
      _isIncrease: boolean,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    globalShortAveragePrices(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    gov(overrides?: CallOverrides): Promise<[string]>;

    isGlobalShortDataReady(overrides?: CallOverrides): Promise<[boolean]>;

    isHandler(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;

    setGlobalShortAveragePrice(
      _token: string,
      _averagePrice: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setGov(
      _gov: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setHandler(
      _handler: string,
      _isActive: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setInitData(
      _tokens: string[],
      _averagePrices: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setIsGlobalShortDataReady(
      value: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

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

    vault(overrides?: CallOverrides): Promise<[string]>;
  };

  MAX_INT256(overrides?: CallOverrides): Promise<BigNumber>;

  _getNextGlobalAveragePrice(
    _averagePrice: BigNumberish,
    _nextPrice: BigNumberish,
    _nextSize: BigNumberish,
    _delta: BigNumberish,
    _realisedPnl: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  data(arg0: BytesLike, overrides?: CallOverrides): Promise<string>;

  getGlobalShortDelta(
    _token: string,
    overrides?: CallOverrides
  ): Promise<[boolean, BigNumber]>;

  getNextGlobalShortData(
    _account: string,
    _collateralToken: string,
    _indexToken: string,
    _nextPrice: BigNumberish,
    _sizeDelta: BigNumberish,
    _isIncrease: boolean,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber]>;

  getNextGlobalShortDataWithRealisedPnl(
    _indexToken: string,
    _nextPrice: BigNumberish,
    _sizeDelta: BigNumberish,
    _realisedPnl: BigNumberish,
    _isIncrease: boolean,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber]>;

  getRealisedPnl(
    _account: string,
    _collateralToken: string,
    _indexToken: string,
    _sizeDelta: BigNumberish,
    _isIncrease: boolean,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  globalShortAveragePrices(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  gov(overrides?: CallOverrides): Promise<string>;

  isGlobalShortDataReady(overrides?: CallOverrides): Promise<boolean>;

  isHandler(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  setGlobalShortAveragePrice(
    _token: string,
    _averagePrice: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setGov(
    _gov: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setHandler(
    _handler: string,
    _isActive: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setInitData(
    _tokens: string[],
    _averagePrices: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setIsGlobalShortDataReady(
    value: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

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

  vault(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    MAX_INT256(overrides?: CallOverrides): Promise<BigNumber>;

    _getNextGlobalAveragePrice(
      _averagePrice: BigNumberish,
      _nextPrice: BigNumberish,
      _nextSize: BigNumberish,
      _delta: BigNumberish,
      _realisedPnl: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    data(arg0: BytesLike, overrides?: CallOverrides): Promise<string>;

    getGlobalShortDelta(
      _token: string,
      overrides?: CallOverrides
    ): Promise<[boolean, BigNumber]>;

    getNextGlobalShortData(
      _account: string,
      _collateralToken: string,
      _indexToken: string,
      _nextPrice: BigNumberish,
      _sizeDelta: BigNumberish,
      _isIncrease: boolean,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    getNextGlobalShortDataWithRealisedPnl(
      _indexToken: string,
      _nextPrice: BigNumberish,
      _sizeDelta: BigNumberish,
      _realisedPnl: BigNumberish,
      _isIncrease: boolean,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    getRealisedPnl(
      _account: string,
      _collateralToken: string,
      _indexToken: string,
      _sizeDelta: BigNumberish,
      _isIncrease: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    globalShortAveragePrices(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    gov(overrides?: CallOverrides): Promise<string>;

    isGlobalShortDataReady(overrides?: CallOverrides): Promise<boolean>;

    isHandler(arg0: string, overrides?: CallOverrides): Promise<boolean>;

    setGlobalShortAveragePrice(
      _token: string,
      _averagePrice: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setGov(_gov: string, overrides?: CallOverrides): Promise<void>;

    setHandler(
      _handler: string,
      _isActive: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    setInitData(
      _tokens: string[],
      _averagePrices: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    setIsGlobalShortDataReady(
      value: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

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

    vault(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "GlobalShortDataUpdated(address,uint256,uint256)"(
      token?: string | null,
      globalShortSize?: null,
      globalShortAveragePrice?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber],
      {
        token: string;
        globalShortSize: BigNumber;
        globalShortAveragePrice: BigNumber;
      }
    >;

    GlobalShortDataUpdated(
      token?: string | null,
      globalShortSize?: null,
      globalShortAveragePrice?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber],
      {
        token: string;
        globalShortSize: BigNumber;
        globalShortAveragePrice: BigNumber;
      }
    >;
  };

  estimateGas: {
    MAX_INT256(overrides?: CallOverrides): Promise<BigNumber>;

    _getNextGlobalAveragePrice(
      _averagePrice: BigNumberish,
      _nextPrice: BigNumberish,
      _nextSize: BigNumberish,
      _delta: BigNumberish,
      _realisedPnl: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    data(arg0: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    getGlobalShortDelta(
      _token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getNextGlobalShortData(
      _account: string,
      _collateralToken: string,
      _indexToken: string,
      _nextPrice: BigNumberish,
      _sizeDelta: BigNumberish,
      _isIncrease: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getNextGlobalShortDataWithRealisedPnl(
      _indexToken: string,
      _nextPrice: BigNumberish,
      _sizeDelta: BigNumberish,
      _realisedPnl: BigNumberish,
      _isIncrease: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRealisedPnl(
      _account: string,
      _collateralToken: string,
      _indexToken: string,
      _sizeDelta: BigNumberish,
      _isIncrease: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    globalShortAveragePrices(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    gov(overrides?: CallOverrides): Promise<BigNumber>;

    isGlobalShortDataReady(overrides?: CallOverrides): Promise<BigNumber>;

    isHandler(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    setGlobalShortAveragePrice(
      _token: string,
      _averagePrice: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setGov(
      _gov: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setHandler(
      _handler: string,
      _isActive: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setInitData(
      _tokens: string[],
      _averagePrices: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setIsGlobalShortDataReady(
      value: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

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

    vault(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    MAX_INT256(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    _getNextGlobalAveragePrice(
      _averagePrice: BigNumberish,
      _nextPrice: BigNumberish,
      _nextSize: BigNumberish,
      _delta: BigNumberish,
      _realisedPnl: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    data(
      arg0: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getGlobalShortDelta(
      _token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getNextGlobalShortData(
      _account: string,
      _collateralToken: string,
      _indexToken: string,
      _nextPrice: BigNumberish,
      _sizeDelta: BigNumberish,
      _isIncrease: boolean,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getNextGlobalShortDataWithRealisedPnl(
      _indexToken: string,
      _nextPrice: BigNumberish,
      _sizeDelta: BigNumberish,
      _realisedPnl: BigNumberish,
      _isIncrease: boolean,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRealisedPnl(
      _account: string,
      _collateralToken: string,
      _indexToken: string,
      _sizeDelta: BigNumberish,
      _isIncrease: boolean,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    globalShortAveragePrices(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    gov(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    isGlobalShortDataReady(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isHandler(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setGlobalShortAveragePrice(
      _token: string,
      _averagePrice: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setGov(
      _gov: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setHandler(
      _handler: string,
      _isActive: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setInitData(
      _tokens: string[],
      _averagePrices: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setIsGlobalShortDataReady(
      value: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
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

    vault(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
