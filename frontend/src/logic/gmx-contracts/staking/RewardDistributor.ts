/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export interface RewardDistributorInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "admin"
      | "distribute"
      | "gov"
      | "lastDistributionTime"
      | "pendingRewards"
      | "rewardToken"
      | "rewardTracker"
      | "setAdmin"
      | "setGov"
      | "setTokensPerInterval"
      | "tokensPerInterval"
      | "updateLastDistributionTime"
      | "withdrawToken"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "Distribute" | "TokensPerIntervalChange"
  ): EventFragment;

  encodeFunctionData(functionFragment: "admin", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "distribute",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "gov", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "lastDistributionTime",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "pendingRewards",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardTracker",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setAdmin",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "setGov", values: [AddressLike]): string;
  encodeFunctionData(
    functionFragment: "setTokensPerInterval",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tokensPerInterval",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "updateLastDistributionTime",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawToken",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "admin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "distribute", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "gov", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "lastDistributionTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "pendingRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardTracker",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setAdmin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setGov", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setTokensPerInterval",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokensPerInterval",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateLastDistributionTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawToken",
    data: BytesLike
  ): Result;
}

export namespace DistributeEvent {
  export type InputTuple = [amount: BigNumberish];
  export type OutputTuple = [amount: bigint];
  export interface OutputObject {
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TokensPerIntervalChangeEvent {
  export type InputTuple = [amount: BigNumberish];
  export type OutputTuple = [amount: bigint];
  export interface OutputObject {
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface RewardDistributor extends BaseContract {
  connect(runner?: ContractRunner | null): BaseContract;
  attach(addressOrName: AddressLike): this;
  deployed(): Promise<this>;

  interface: RewardDistributorInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  admin: TypedContractMethod<[], [string], "view">;

  distribute: TypedContractMethod<[], [bigint], "nonpayable">;

  gov: TypedContractMethod<[], [string], "view">;

  lastDistributionTime: TypedContractMethod<[], [bigint], "view">;

  pendingRewards: TypedContractMethod<[], [bigint], "view">;

  rewardToken: TypedContractMethod<[], [string], "view">;

  rewardTracker: TypedContractMethod<[], [string], "view">;

  setAdmin: TypedContractMethod<[_admin: AddressLike], [void], "nonpayable">;

  setGov: TypedContractMethod<[_gov: AddressLike], [void], "nonpayable">;

  setTokensPerInterval: TypedContractMethod<
    [_amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  tokensPerInterval: TypedContractMethod<[], [bigint], "view">;

  updateLastDistributionTime: TypedContractMethod<[], [void], "nonpayable">;

  withdrawToken: TypedContractMethod<
    [_token: AddressLike, _account: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "admin"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "distribute"
  ): TypedContractMethod<[], [bigint], "nonpayable">;
  getFunction(
    nameOrSignature: "gov"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "lastDistributionTime"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "pendingRewards"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "rewardToken"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "rewardTracker"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "setAdmin"
  ): TypedContractMethod<[_admin: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setGov"
  ): TypedContractMethod<[_gov: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setTokensPerInterval"
  ): TypedContractMethod<[_amount: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "tokensPerInterval"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "updateLastDistributionTime"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "withdrawToken"
  ): TypedContractMethod<
    [_token: AddressLike, _account: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "Distribute"
  ): TypedContractEvent<
    DistributeEvent.InputTuple,
    DistributeEvent.OutputTuple,
    DistributeEvent.OutputObject
  >;
  getEvent(
    key: "TokensPerIntervalChange"
  ): TypedContractEvent<
    TokensPerIntervalChangeEvent.InputTuple,
    TokensPerIntervalChangeEvent.OutputTuple,
    TokensPerIntervalChangeEvent.OutputObject
  >;

  filters: {
    "Distribute(uint256)": TypedContractEvent<
      DistributeEvent.InputTuple,
      DistributeEvent.OutputTuple,
      DistributeEvent.OutputObject
    >;
    Distribute: TypedContractEvent<
      DistributeEvent.InputTuple,
      DistributeEvent.OutputTuple,
      DistributeEvent.OutputObject
    >;

    "TokensPerIntervalChange(uint256)": TypedContractEvent<
      TokensPerIntervalChangeEvent.InputTuple,
      TokensPerIntervalChangeEvent.OutputTuple,
      TokensPerIntervalChangeEvent.OutputObject
    >;
    TokensPerIntervalChange: TypedContractEvent<
      TokensPerIntervalChangeEvent.InputTuple,
      TokensPerIntervalChangeEvent.OutputTuple,
      TokensPerIntervalChangeEvent.OutputObject
    >;
  };
}
