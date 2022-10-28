/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
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

export interface BridgeInterface extends utils.Interface {
  functions: {
    "gov()": FunctionFragment;
    "setGov(address)": FunctionFragment;
    "token()": FunctionFragment;
    "unwrap(uint256,address)": FunctionFragment;
    "wToken()": FunctionFragment;
    "withdrawToken(address,address,uint256)": FunctionFragment;
    "wrap(uint256,address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "gov"
      | "setGov"
      | "token"
      | "unwrap"
      | "wToken"
      | "withdrawToken"
      | "wrap"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "gov", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "setGov",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "token", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "unwrap",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "wToken", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "withdrawToken",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "wrap",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(functionFragment: "gov", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setGov", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "token", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "unwrap", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "wToken", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdrawToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "wrap", data: BytesLike): Result;

  events: {};
}

export interface Bridge extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: BridgeInterface;

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
    gov(overrides?: CallOverrides): Promise<[string]>;

    setGov(
      _gov: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    token(overrides?: CallOverrides): Promise<[string]>;

    unwrap(
      _amount: PromiseOrValue<BigNumberish>,
      _receiver: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    wToken(overrides?: CallOverrides): Promise<[string]>;

    withdrawToken(
      _token: PromiseOrValue<string>,
      _account: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    wrap(
      _amount: PromiseOrValue<BigNumberish>,
      _receiver: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  gov(overrides?: CallOverrides): Promise<string>;

  setGov(
    _gov: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  token(overrides?: CallOverrides): Promise<string>;

  unwrap(
    _amount: PromiseOrValue<BigNumberish>,
    _receiver: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  wToken(overrides?: CallOverrides): Promise<string>;

  withdrawToken(
    _token: PromiseOrValue<string>,
    _account: PromiseOrValue<string>,
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  wrap(
    _amount: PromiseOrValue<BigNumberish>,
    _receiver: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    gov(overrides?: CallOverrides): Promise<string>;

    setGov(
      _gov: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    token(overrides?: CallOverrides): Promise<string>;

    unwrap(
      _amount: PromiseOrValue<BigNumberish>,
      _receiver: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    wToken(overrides?: CallOverrides): Promise<string>;

    withdrawToken(
      _token: PromiseOrValue<string>,
      _account: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    wrap(
      _amount: PromiseOrValue<BigNumberish>,
      _receiver: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    gov(overrides?: CallOverrides): Promise<BigNumber>;

    setGov(
      _gov: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    token(overrides?: CallOverrides): Promise<BigNumber>;

    unwrap(
      _amount: PromiseOrValue<BigNumberish>,
      _receiver: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    wToken(overrides?: CallOverrides): Promise<BigNumber>;

    withdrawToken(
      _token: PromiseOrValue<string>,
      _account: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    wrap(
      _amount: PromiseOrValue<BigNumberish>,
      _receiver: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    gov(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setGov(
      _gov: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    token(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    unwrap(
      _amount: PromiseOrValue<BigNumberish>,
      _receiver: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    wToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdrawToken(
      _token: PromiseOrValue<string>,
      _account: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    wrap(
      _amount: PromiseOrValue<BigNumberish>,
      _receiver: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}