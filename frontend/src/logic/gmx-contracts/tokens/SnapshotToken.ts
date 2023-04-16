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

export interface SnapshotTokenInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "addAdmin"
      | "addNonStakingAccount"
      | "admins"
      | "allowance"
      | "allowances"
      | "approve"
      | "balanceOf"
      | "balances"
      | "batchMint"
      | "burn"
      | "claim"
      | "decimals"
      | "gov"
      | "inPrivateTransferMode"
      | "isHandler"
      | "isMinter"
      | "mint"
      | "name"
      | "nonStakingAccounts"
      | "nonStakingSupply"
      | "recoverClaim"
      | "removeAdmin"
      | "removeNonStakingAccount"
      | "setGov"
      | "setHandler"
      | "setInPrivateTransferMode"
      | "setInfo"
      | "setMinter"
      | "setYieldTrackers"
      | "stakedBalance"
      | "symbol"
      | "totalStaked"
      | "totalSupply"
      | "transfer"
      | "transferFrom"
      | "withdrawToken"
      | "yieldTrackers"
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "Approval" | "Transfer"): EventFragment;

  encodeFunctionData(
    functionFragment: "addAdmin",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "addNonStakingAccount",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "admins", values: [AddressLike]): string;
  encodeFunctionData(
    functionFragment: "allowance",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "allowances",
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
    functionFragment: "batchMint",
    values: [AddressLike[], BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "burn",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "claim", values: [AddressLike]): string;
  encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
  encodeFunctionData(functionFragment: "gov", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "inPrivateTransferMode",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isHandler",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isMinter",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "mint",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "nonStakingAccounts",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "nonStakingSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "recoverClaim",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "removeAdmin",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "removeNonStakingAccount",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "setGov", values: [AddressLike]): string;
  encodeFunctionData(
    functionFragment: "setHandler",
    values: [AddressLike, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setInPrivateTransferMode",
    values: [boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setInfo",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setMinter",
    values: [AddressLike, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setYieldTrackers",
    values: [AddressLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "stakedBalance",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalStaked",
    values?: undefined
  ): string;
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
    functionFragment: "withdrawToken",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "yieldTrackers",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "addAdmin", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "addNonStakingAccount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "admins", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "allowances", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balances", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "batchMint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "gov", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "inPrivateTransferMode",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isHandler", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isMinter", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "nonStakingAccounts",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "nonStakingSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "recoverClaim",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeNonStakingAccount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setGov", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setHandler", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setInPrivateTransferMode",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setInfo", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setMinter", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setYieldTrackers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "stakedBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalStaked",
    data: BytesLike
  ): Result;
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
    functionFragment: "withdrawToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "yieldTrackers",
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

export interface SnapshotToken extends BaseContract {
  connect(runner?: ContractRunner | null): BaseContract;
  attach(addressOrName: AddressLike): this;
  deployed(): Promise<this>;

  interface: SnapshotTokenInterface;

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

  addAdmin: TypedContractMethod<[_account: AddressLike], [void], "nonpayable">;

  addNonStakingAccount: TypedContractMethod<
    [_account: AddressLike],
    [void],
    "nonpayable"
  >;

  admins: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  allowance: TypedContractMethod<
    [_owner: AddressLike, _spender: AddressLike],
    [bigint],
    "view"
  >;

  allowances: TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike],
    [bigint],
    "view"
  >;

  approve: TypedContractMethod<
    [_spender: AddressLike, _amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  balanceOf: TypedContractMethod<[_account: AddressLike], [bigint], "view">;

  balances: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;

  batchMint: TypedContractMethod<
    [_accounts: AddressLike[], _amounts: BigNumberish[]],
    [void],
    "nonpayable"
  >;

  burn: TypedContractMethod<
    [_account: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  claim: TypedContractMethod<[_receiver: AddressLike], [void], "nonpayable">;

  decimals: TypedContractMethod<[], [bigint], "view">;

  gov: TypedContractMethod<[], [string], "view">;

  inPrivateTransferMode: TypedContractMethod<[], [boolean], "view">;

  isHandler: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  isMinter: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  mint: TypedContractMethod<
    [_account: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  name: TypedContractMethod<[], [string], "view">;

  nonStakingAccounts: TypedContractMethod<
    [arg0: AddressLike],
    [boolean],
    "view"
  >;

  nonStakingSupply: TypedContractMethod<[], [bigint], "view">;

  recoverClaim: TypedContractMethod<
    [_account: AddressLike, _receiver: AddressLike],
    [void],
    "nonpayable"
  >;

  removeAdmin: TypedContractMethod<
    [_account: AddressLike],
    [void],
    "nonpayable"
  >;

  removeNonStakingAccount: TypedContractMethod<
    [_account: AddressLike],
    [void],
    "nonpayable"
  >;

  setGov: TypedContractMethod<[_gov: AddressLike], [void], "nonpayable">;

  setHandler: TypedContractMethod<
    [_handler: AddressLike, _isActive: boolean],
    [void],
    "nonpayable"
  >;

  setInPrivateTransferMode: TypedContractMethod<
    [_inPrivateTransferMode: boolean],
    [void],
    "nonpayable"
  >;

  setInfo: TypedContractMethod<
    [_name: string, _symbol: string],
    [void],
    "nonpayable"
  >;

  setMinter: TypedContractMethod<
    [_minter: AddressLike, _isActive: boolean],
    [void],
    "nonpayable"
  >;

  setYieldTrackers: TypedContractMethod<
    [_yieldTrackers: AddressLike[]],
    [void],
    "nonpayable"
  >;

  stakedBalance: TypedContractMethod<[_account: AddressLike], [bigint], "view">;

  symbol: TypedContractMethod<[], [string], "view">;

  totalStaked: TypedContractMethod<[], [bigint], "view">;

  totalSupply: TypedContractMethod<[], [bigint], "view">;

  transfer: TypedContractMethod<
    [_recipient: AddressLike, _amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  transferFrom: TypedContractMethod<
    [_sender: AddressLike, _recipient: AddressLike, _amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  withdrawToken: TypedContractMethod<
    [_token: AddressLike, _account: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  yieldTrackers: TypedContractMethod<[arg0: BigNumberish], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "addAdmin"
  ): TypedContractMethod<[_account: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "addNonStakingAccount"
  ): TypedContractMethod<[_account: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "admins"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "allowance"
  ): TypedContractMethod<
    [_owner: AddressLike, _spender: AddressLike],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "allowances"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "approve"
  ): TypedContractMethod<
    [_spender: AddressLike, _amount: BigNumberish],
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
    nameOrSignature: "batchMint"
  ): TypedContractMethod<
    [_accounts: AddressLike[], _amounts: BigNumberish[]],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "burn"
  ): TypedContractMethod<
    [_account: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "claim"
  ): TypedContractMethod<[_receiver: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "decimals"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "gov"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "inPrivateTransferMode"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "isHandler"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "isMinter"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "mint"
  ): TypedContractMethod<
    [_account: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "name"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "nonStakingAccounts"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "nonStakingSupply"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "recoverClaim"
  ): TypedContractMethod<
    [_account: AddressLike, _receiver: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "removeAdmin"
  ): TypedContractMethod<[_account: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "removeNonStakingAccount"
  ): TypedContractMethod<[_account: AddressLike], [void], "nonpayable">;
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
    nameOrSignature: "setInPrivateTransferMode"
  ): TypedContractMethod<
    [_inPrivateTransferMode: boolean],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setInfo"
  ): TypedContractMethod<
    [_name: string, _symbol: string],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setMinter"
  ): TypedContractMethod<
    [_minter: AddressLike, _isActive: boolean],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setYieldTrackers"
  ): TypedContractMethod<[_yieldTrackers: AddressLike[]], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "stakedBalance"
  ): TypedContractMethod<[_account: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "symbol"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "totalStaked"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "totalSupply"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "transfer"
  ): TypedContractMethod<
    [_recipient: AddressLike, _amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferFrom"
  ): TypedContractMethod<
    [_sender: AddressLike, _recipient: AddressLike, _amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "withdrawToken"
  ): TypedContractMethod<
    [_token: AddressLike, _account: AddressLike, _amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "yieldTrackers"
  ): TypedContractMethod<[arg0: BigNumberish], [string], "view">;

  getEvent(
    key: "Approval"
  ): TypedContractEvent<
    ApprovalEvent.InputTuple,
    ApprovalEvent.OutputTuple,
    ApprovalEvent.OutputObject
  >;
  getEvent(
    key: "Transfer"
  ): TypedContractEvent<
    TransferEvent.InputTuple,
    TransferEvent.OutputTuple,
    TransferEvent.OutputObject
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
  };
}
