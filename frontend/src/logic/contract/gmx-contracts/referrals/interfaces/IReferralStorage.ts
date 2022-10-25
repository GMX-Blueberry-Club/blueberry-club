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
} from "../../common";

export interface IReferralStorageInterface extends utils.Interface {
  functions: {
    "codeOwners(bytes32)": FunctionFragment;
    "getTraderReferralInfo(address)": FunctionFragment;
    "govSetCodeOwner(bytes32,address)": FunctionFragment;
    "setReferrerTier(address,uint256)": FunctionFragment;
    "setTier(uint256,uint256,uint256)": FunctionFragment;
    "setTraderReferralCode(address,bytes32)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "codeOwners"
      | "getTraderReferralInfo"
      | "govSetCodeOwner"
      | "setReferrerTier"
      | "setTier"
      | "setTraderReferralCode"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "codeOwners",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "getTraderReferralInfo",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "govSetCodeOwner",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setReferrerTier",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setTier",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setTraderReferralCode",
    values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>]
  ): string;

  decodeFunctionResult(functionFragment: "codeOwners", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getTraderReferralInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "govSetCodeOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setReferrerTier",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setTier", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setTraderReferralCode",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IReferralStorage extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IReferralStorageInterface;

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
    codeOwners(
      _code: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getTraderReferralInfo(
      _account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string, string]>;

    govSetCodeOwner(
      _code: PromiseOrValue<BytesLike>,
      _newAccount: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setReferrerTier(
      _referrer: PromiseOrValue<string>,
      _tierId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setTier(
      _tierId: PromiseOrValue<BigNumberish>,
      _totalRebate: PromiseOrValue<BigNumberish>,
      _discountShare: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setTraderReferralCode(
      _account: PromiseOrValue<string>,
      _code: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  codeOwners(
    _code: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<string>;

  getTraderReferralInfo(
    _account: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<[string, string]>;

  govSetCodeOwner(
    _code: PromiseOrValue<BytesLike>,
    _newAccount: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setReferrerTier(
    _referrer: PromiseOrValue<string>,
    _tierId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setTier(
    _tierId: PromiseOrValue<BigNumberish>,
    _totalRebate: PromiseOrValue<BigNumberish>,
    _discountShare: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setTraderReferralCode(
    _account: PromiseOrValue<string>,
    _code: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    codeOwners(
      _code: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<string>;

    getTraderReferralInfo(
      _account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string, string]>;

    govSetCodeOwner(
      _code: PromiseOrValue<BytesLike>,
      _newAccount: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setReferrerTier(
      _referrer: PromiseOrValue<string>,
      _tierId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setTier(
      _tierId: PromiseOrValue<BigNumberish>,
      _totalRebate: PromiseOrValue<BigNumberish>,
      _discountShare: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setTraderReferralCode(
      _account: PromiseOrValue<string>,
      _code: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    codeOwners(
      _code: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTraderReferralInfo(
      _account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    govSetCodeOwner(
      _code: PromiseOrValue<BytesLike>,
      _newAccount: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setReferrerTier(
      _referrer: PromiseOrValue<string>,
      _tierId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setTier(
      _tierId: PromiseOrValue<BigNumberish>,
      _totalRebate: PromiseOrValue<BigNumberish>,
      _discountShare: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setTraderReferralCode(
      _account: PromiseOrValue<string>,
      _code: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    codeOwners(
      _code: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTraderReferralInfo(
      _account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    govSetCodeOwner(
      _code: PromiseOrValue<BytesLike>,
      _newAccount: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setReferrerTier(
      _referrer: PromiseOrValue<string>,
      _tierId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setTier(
      _tierId: PromiseOrValue<BigNumberish>,
      _totalRebate: PromiseOrValue<BigNumberish>,
      _discountShare: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setTraderReferralCode(
      _account: PromiseOrValue<string>,
      _code: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
