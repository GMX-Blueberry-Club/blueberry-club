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

export interface VesterInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "allowance"
      | "approve"
      | "balanceOf"
      | "balances"
      | "bonusRewards"
      | "claim"
      | "claimForAccount"
      | "claimable"
      | "claimableToken"
      | "claimedAmounts"
      | "cumulativeClaimAmounts"
      | "cumulativeRewardDeductions"
      | "decimals"
      | "deposit"
      | "depositForAccount"
      | "esToken"
      | "getCombinedAverageStakedAmount"
      | "getMaxVestableAmount"
      | "getPairAmount"
      | "getTotalVested"
      | "getVestedAmount"
      | "gov"
      | "hasMaxVestableAmount"
      | "hasPairToken"
      | "hasRewardTracker"
      | "isHandler"
      | "lastVestingTimes"
      | "name"
      | "pairAmounts"
      | "pairSupply"
      | "pairToken"
      | "rewardTracker"
      | "setBonusRewards"
      | "setCumulativeRewardDeductions"
      | "setGov"
      | "setHandler"
      | "setHasMaxVestableAmount"
      | "setTransferredAverageStakedAmounts"
      | "setTransferredCumulativeRewards"
      | "symbol"
      | "totalSupply"
      | "transfer"
      | "transferFrom"
      | "transferStakeValues"
      | "transferredAverageStakedAmounts"
      | "transferredCumulativeRewards"
      | "vestingDuration"
      | "withdraw"
      | "withdrawToken"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "Approval"
      | "Claim"
      | "Deposit"
      | "PairTransfer"
      | "Transfer"
      | "Withdraw"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "allowance",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOf",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "balances",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "bonusRewards",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "claim", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "claimForAccount",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "claimable",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "claimableToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "claimedAmounts",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "cumulativeClaimAmounts",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "cumulativeRewardDeductions",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "depositForAccount",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "esToken", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getCombinedAverageStakedAmount",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getMaxVestableAmount",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getPairAmount",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getTotalVested",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getVestedAmount",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "gov", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "hasMaxVestableAmount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "hasPairToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "hasRewardTracker",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isHandler",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "lastVestingTimes",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "pairAmounts",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "pairSupply",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "pairToken", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "rewardTracker",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setBonusRewards",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setCumulativeRewardDeductions",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "setGov", values: [AddressLike]): string;
  encodeFunctionData(
    functionFragment: "setHandler",
    values: [AddressLike, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setHasMaxVestableAmount",
    values: [boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setTransferredAverageStakedAmounts",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setTransferredCumulativeRewards",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transfer",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferStakeValues",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "transferredAverageStakedAmounts",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "transferredCumulativeRewards",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "vestingDuration",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "withdraw", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "withdrawToken",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balances", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "bonusRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "claimForAccount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "claimable", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "claimableToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "claimedAmounts",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "cumulativeClaimAmounts",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "cumulativeRewardDeductions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "depositForAccount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "esToken", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getCombinedAverageStakedAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getMaxVestableAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPairAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTotalVested",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getVestedAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "gov", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "hasMaxVestableAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "hasPairToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "hasRewardTracker",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isHandler", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "lastVestingTimes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pairAmounts",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "pairSupply", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pairToken", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "rewardTracker",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setBonusRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setCumulativeRewardDeductions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setGov", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setHandler", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setHasMaxVestableAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTransferredAverageStakedAmounts",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTransferredCumulativeRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferStakeValues",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferredAverageStakedAmounts",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferredCumulativeRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "vestingDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdrawToken",
    data: BytesLike
  ): Result;
}

export namespace ApprovalEvent {
  export type InputTuple = [
    owner: AddressLike,
    spender: AddressLike,
    value: BigNumberish
  ];
  export type OutputTuple = [owner: string, spender: string, value: bigint];
  export interface OutputObject {
    owner: string;
    spender: string;
    value: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ClaimEvent {
  export type InputTuple = [receiver: AddressLike, amount: BigNumberish];
  export type OutputTuple = [receiver: string, amount: bigint];
  export interface OutputObject {
    receiver: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DepositEvent {
  export type InputTuple = [account: AddressLike, amount: BigNumberish];
  export type OutputTuple = [account: string, amount: bigint];
  export interface OutputObject {
    account: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PairTransferEvent {
  export type InputTuple = [
    from: AddressLike,
    to: AddressLike,
    value: BigNumberish
  ];
  export type OutputTuple = [from: string, to: string, value: bigint];
  export interface OutputObject {
    from: string;
    to: string;
    value: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TransferEvent {
  export type InputTuple = [
    from: AddressLike,
    to: AddressLike,
    value: BigNumberish
  ];
  export type OutputTuple = [from: string, to: string, value: bigint];
  export interface OutputObject {
    from: string;
    to: string;
    value: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace WithdrawEvent {
  export type InputTuple = [
    account: AddressLike,
    claimedAmount: BigNumberish,
    balance: BigNumberish
  ];
  export type OutputTuple = [
    account: string,
    claimedAmount: bigint,
    balance: bigint
  ];
  export interface OutputObject {
    account: string;
    claimedAmount: bigint;
    balance: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface Vester extends BaseContract {
  connect(runner?: ContractRunner | null): BaseContract;
  attach(addressOrName: AddressLike): this;
  deployed(): Promise<this>;

  interface: VesterInterface;

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

  allowance: TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike],
    [bigint],
    "view"
  >;

  approve: TypedContractMethod<
    [arg0: AddressLike, arg1: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  balanceOf: TypedContractMethod<[_account: AddressLike], [bigint], "view">;

  balances: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;

  bonusRewards: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;

  claim: TypedContractMethod<[], [bigint], "nonpayable">;

  claimForAccount: TypedContractMethod<
    [_account: AddressLike, _receiver: AddressLike],
    [bigint],
    "nonpayable"
  >;

  claimable: TypedContractMethod<[_account: AddressLike], [bigint], "view">;

  claimableToken: TypedContractMethod<[], [string], "view">;

  claimedAmounts: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;

  cumulativeClaimAmounts: TypedContractMethod<
    [arg0: AddressLike],
    [bigint],
    "view"
  >;

  cumulativeRewardDeductions: TypedContractMethod<
    [arg0: AddressLike],
    [bigint],
    "view"
  >;

  decimals: TypedContractMethod<[], [bigint], "view">;

  deposit: TypedContractMethod<[_amount: BigNumberish], [void], "nonpayable">;

  depositForAccount: TypedContractMethod<
    [_account: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  esToken: TypedContractMethod<[], [string], "view">;

  getCombinedAverageStakedAmount: TypedContractMethod<
    [_account: AddressLike],
    [bigint],
    "view"
  >;

  getMaxVestableAmount: TypedContractMethod<
    [_account: AddressLike],
    [bigint],
    "view"
  >;

  getPairAmount: TypedContractMethod<
    [_account: AddressLike, _esAmount: BigNumberish],
    [bigint],
    "view"
  >;

  getTotalVested: TypedContractMethod<
    [_account: AddressLike],
    [bigint],
    "view"
  >;

  getVestedAmount: TypedContractMethod<
    [_account: AddressLike],
    [bigint],
    "view"
  >;

  gov: TypedContractMethod<[], [string], "view">;

  hasMaxVestableAmount: TypedContractMethod<[], [boolean], "view">;

  hasPairToken: TypedContractMethod<[], [boolean], "view">;

  hasRewardTracker: TypedContractMethod<[], [boolean], "view">;

  isHandler: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  lastVestingTimes: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;

  name: TypedContractMethod<[], [string], "view">;

  pairAmounts: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;

  pairSupply: TypedContractMethod<[], [bigint], "view">;

  pairToken: TypedContractMethod<[], [string], "view">;

  rewardTracker: TypedContractMethod<[], [string], "view">;

  setBonusRewards: TypedContractMethod<
    [_account: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  setCumulativeRewardDeductions: TypedContractMethod<
    [_account: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  setGov: TypedContractMethod<[_gov: AddressLike], [void], "nonpayable">;

  setHandler: TypedContractMethod<
    [_handler: AddressLike, _isActive: boolean],
    [void],
    "nonpayable"
  >;

  setHasMaxVestableAmount: TypedContractMethod<
    [_hasMaxVestableAmount: boolean],
    [void],
    "nonpayable"
  >;

  setTransferredAverageStakedAmounts: TypedContractMethod<
    [_account: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  setTransferredCumulativeRewards: TypedContractMethod<
    [_account: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  symbol: TypedContractMethod<[], [string], "view">;

  totalSupply: TypedContractMethod<[], [bigint], "view">;

  transfer: TypedContractMethod<
    [arg0: AddressLike, arg1: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  transferFrom: TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike, arg2: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  transferStakeValues: TypedContractMethod<
    [_sender: AddressLike, _receiver: AddressLike],
    [void],
    "nonpayable"
  >;

  transferredAverageStakedAmounts: TypedContractMethod<
    [arg0: AddressLike],
    [bigint],
    "view"
  >;

  transferredCumulativeRewards: TypedContractMethod<
    [arg0: AddressLike],
    [bigint],
    "view"
  >;

  vestingDuration: TypedContractMethod<[], [bigint], "view">;

  withdraw: TypedContractMethod<[], [void], "nonpayable">;

  withdrawToken: TypedContractMethod<
    [_token: AddressLike, _account: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "allowance"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "approve"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "balanceOf"
  ): TypedContractMethod<[_account: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "balances"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "bonusRewards"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "claim"
  ): TypedContractMethod<[], [bigint], "nonpayable">;
  getFunction(
    nameOrSignature: "claimForAccount"
  ): TypedContractMethod<
    [_account: AddressLike, _receiver: AddressLike],
    [bigint],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "claimable"
  ): TypedContractMethod<[_account: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "claimableToken"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "claimedAmounts"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "cumulativeClaimAmounts"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "cumulativeRewardDeductions"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "decimals"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "deposit"
  ): TypedContractMethod<[_amount: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "depositForAccount"
  ): TypedContractMethod<
    [_account: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "esToken"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getCombinedAverageStakedAmount"
  ): TypedContractMethod<[_account: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "getMaxVestableAmount"
  ): TypedContractMethod<[_account: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "getPairAmount"
  ): TypedContractMethod<
    [_account: AddressLike, _esAmount: BigNumberish],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "getTotalVested"
  ): TypedContractMethod<[_account: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "getVestedAmount"
  ): TypedContractMethod<[_account: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "gov"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "hasMaxVestableAmount"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "hasPairToken"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "hasRewardTracker"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "isHandler"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "lastVestingTimes"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "name"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "pairAmounts"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "pairSupply"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "pairToken"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "rewardTracker"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "setBonusRewards"
  ): TypedContractMethod<
    [_account: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setCumulativeRewardDeductions"
  ): TypedContractMethod<
    [_account: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setGov"
  ): TypedContractMethod<[_gov: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setHandler"
  ): TypedContractMethod<
    [_handler: AddressLike, _isActive: boolean],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setHasMaxVestableAmount"
  ): TypedContractMethod<
    [_hasMaxVestableAmount: boolean],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setTransferredAverageStakedAmounts"
  ): TypedContractMethod<
    [_account: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setTransferredCumulativeRewards"
  ): TypedContractMethod<
    [_account: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "symbol"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "totalSupply"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "transfer"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferFrom"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike, arg2: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferStakeValues"
  ): TypedContractMethod<
    [_sender: AddressLike, _receiver: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferredAverageStakedAmounts"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "transferredCumulativeRewards"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "vestingDuration"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "withdrawToken"
  ): TypedContractMethod<
    [_token: AddressLike, _account: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "Approval"
  ): TypedContractEvent<
    ApprovalEvent.InputTuple,
    ApprovalEvent.OutputTuple,
    ApprovalEvent.OutputObject
  >;
  getEvent(
    key: "Claim"
  ): TypedContractEvent<
    ClaimEvent.InputTuple,
    ClaimEvent.OutputTuple,
    ClaimEvent.OutputObject
  >;
  getEvent(
    key: "Deposit"
  ): TypedContractEvent<
    DepositEvent.InputTuple,
    DepositEvent.OutputTuple,
    DepositEvent.OutputObject
  >;
  getEvent(
    key: "PairTransfer"
  ): TypedContractEvent<
    PairTransferEvent.InputTuple,
    PairTransferEvent.OutputTuple,
    PairTransferEvent.OutputObject
  >;
  getEvent(
    key: "Transfer"
  ): TypedContractEvent<
    TransferEvent.InputTuple,
    TransferEvent.OutputTuple,
    TransferEvent.OutputObject
  >;
  getEvent(
    key: "Withdraw"
  ): TypedContractEvent<
    WithdrawEvent.InputTuple,
    WithdrawEvent.OutputTuple,
    WithdrawEvent.OutputObject
  >;

  filters: {
    "Approval(address,address,uint256)": TypedContractEvent<
      ApprovalEvent.InputTuple,
      ApprovalEvent.OutputTuple,
      ApprovalEvent.OutputObject
    >;
    Approval: TypedContractEvent<
      ApprovalEvent.InputTuple,
      ApprovalEvent.OutputTuple,
      ApprovalEvent.OutputObject
    >;

    "Claim(address,uint256)": TypedContractEvent<
      ClaimEvent.InputTuple,
      ClaimEvent.OutputTuple,
      ClaimEvent.OutputObject
    >;
    Claim: TypedContractEvent<
      ClaimEvent.InputTuple,
      ClaimEvent.OutputTuple,
      ClaimEvent.OutputObject
    >;

    "Deposit(address,uint256)": TypedContractEvent<
      DepositEvent.InputTuple,
      DepositEvent.OutputTuple,
      DepositEvent.OutputObject
    >;
    Deposit: TypedContractEvent<
      DepositEvent.InputTuple,
      DepositEvent.OutputTuple,
      DepositEvent.OutputObject
    >;

    "PairTransfer(address,address,uint256)": TypedContractEvent<
      PairTransferEvent.InputTuple,
      PairTransferEvent.OutputTuple,
      PairTransferEvent.OutputObject
    >;
    PairTransfer: TypedContractEvent<
      PairTransferEvent.InputTuple,
      PairTransferEvent.OutputTuple,
      PairTransferEvent.OutputObject
    >;

    "Transfer(address,address,uint256)": TypedContractEvent<
      TransferEvent.InputTuple,
      TransferEvent.OutputTuple,
      TransferEvent.OutputObject
    >;
    Transfer: TypedContractEvent<
      TransferEvent.InputTuple,
      TransferEvent.OutputTuple,
      TransferEvent.OutputObject
    >;

    "Withdraw(address,uint256,uint256)": TypedContractEvent<
      WithdrawEvent.InputTuple,
      WithdrawEvent.OutputTuple,
      WithdrawEvent.OutputObject
    >;
    Withdraw: TypedContractEvent<
      WithdrawEvent.InputTuple,
      WithdrawEvent.OutputTuple,
      WithdrawEvent.OutputObject
    >;
  };
}
