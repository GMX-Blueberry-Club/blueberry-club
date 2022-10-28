/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export interface RewardReaderInterface extends utils.Interface {
  functions: {
    "getDepositBalances(address,address[],address[])": FunctionFragment;
    "getStakingInfo(address,address[])": FunctionFragment;
    "getVestingInfoV2(address,address[])": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "getDepositBalances"
      | "getStakingInfo"
      | "getVestingInfoV2"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getDepositBalances",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>[],
      PromiseOrValue<string>[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getStakingInfo",
    values: [PromiseOrValue<string>, PromiseOrValue<string>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "getVestingInfoV2",
    values: [PromiseOrValue<string>, PromiseOrValue<string>[]]
  ): string;

  decodeFunctionResult(
    functionFragment: "getDepositBalances",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getStakingInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getVestingInfoV2",
    data: BytesLike
  ): Result;

  events: {};
}

export interface RewardReader extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: RewardReaderInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    getDepositBalances(
      _account: PromiseOrValue<string>,
      _depositTokens: PromiseOrValue<string>[],
      _rewardTrackers: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    getStakingInfo(
      _account: PromiseOrValue<string>,
      _rewardTrackers: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    getVestingInfoV2(
      _account: PromiseOrValue<string>,
      _vesters: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;
  };

  getDepositBalances(
    _account: PromiseOrValue<string>,
    _depositTokens: PromiseOrValue<string>[],
    _rewardTrackers: PromiseOrValue<string>[],
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  getStakingInfo(
    _account: PromiseOrValue<string>,
    _rewardTrackers: PromiseOrValue<string>[],
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  getVestingInfoV2(
    _account: PromiseOrValue<string>,
    _vesters: PromiseOrValue<string>[],
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  callStatic: {
    getDepositBalances(
      _account: PromiseOrValue<string>,
      _depositTokens: PromiseOrValue<string>[],
      _rewardTrackers: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    getStakingInfo(
      _account: PromiseOrValue<string>,
      _rewardTrackers: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    getVestingInfoV2(
      _account: PromiseOrValue<string>,
      _vesters: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;
  };

  filters: {};

  estimateGas: {
    getDepositBalances(
      _account: PromiseOrValue<string>,
      _depositTokens: PromiseOrValue<string>[],
      _rewardTrackers: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getStakingInfo(
      _account: PromiseOrValue<string>,
      _rewardTrackers: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getVestingInfoV2(
      _account: PromiseOrValue<string>,
      _vesters: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getDepositBalances(
      _account: PromiseOrValue<string>,
      _depositTokens: PromiseOrValue<string>[],
      _rewardTrackers: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getStakingInfo(
      _account: PromiseOrValue<string>,
      _rewardTrackers: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getVestingInfoV2(
      _account: PromiseOrValue<string>,
      _vesters: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}