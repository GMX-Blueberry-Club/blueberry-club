/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export interface PositionRouterCallbackReceiverTestInterface
  extends utils.Interface {
  functions: {
    "gmxPositionCallback(bytes32,bool,bool)": FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: "gmxPositionCallback"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "gmxPositionCallback",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<boolean>,
      PromiseOrValue<boolean>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "gmxPositionCallback",
    data: BytesLike
  ): Result;

  events: {
    "CallbackCalled(bytes32,bool,bool)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "CallbackCalled"): EventFragment;
}

export interface CallbackCalledEventObject {
  positionKey: string;
  isExecuted: boolean;
  isIncrease: boolean;
}
export type CallbackCalledEvent = TypedEvent<
  [string, boolean, boolean],
  CallbackCalledEventObject
>;

export type CallbackCalledEventFilter = TypedEventFilter<CallbackCalledEvent>;

export interface PositionRouterCallbackReceiverTest extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PositionRouterCallbackReceiverTestInterface;

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
    gmxPositionCallback(
      positionKey: PromiseOrValue<BytesLike>,
      isExecuted: PromiseOrValue<boolean>,
      isIncrease: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  gmxPositionCallback(
    positionKey: PromiseOrValue<BytesLike>,
    isExecuted: PromiseOrValue<boolean>,
    isIncrease: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    gmxPositionCallback(
      positionKey: PromiseOrValue<BytesLike>,
      isExecuted: PromiseOrValue<boolean>,
      isIncrease: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "CallbackCalled(bytes32,bool,bool)"(
      positionKey?: null,
      isExecuted?: null,
      isIncrease?: null
    ): CallbackCalledEventFilter;
    CallbackCalled(
      positionKey?: null,
      isExecuted?: null,
      isIncrease?: null
    ): CallbackCalledEventFilter;
  };

  estimateGas: {
    gmxPositionCallback(
      positionKey: PromiseOrValue<BytesLike>,
      isExecuted: PromiseOrValue<boolean>,
      isIncrease: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    gmxPositionCallback(
      positionKey: PromiseOrValue<BytesLike>,
      isExecuted: PromiseOrValue<boolean>,
      isIncrease: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
