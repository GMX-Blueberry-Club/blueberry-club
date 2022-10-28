/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { UniFactory, UniFactoryInterface } from "../../amm/UniFactory";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint24",
        name: "",
        type: "uint24",
      },
    ],
    name: "getPool",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060e38061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80631698ee8214602d575b600080fd5b606660048036036060811015604157600080fd5b5080356001600160a01b03908116916020810135909116906040013562ffffff166082565b604080516001600160a01b039092168252519081900360200190f35b600060208181529381526040808220855292815282812090935282529020546001600160a01b03168156fea264697066735822122040c96d6664772ed85a199da374e1ec74fbd2b406c7d81b818870a9f12a3bb6e564736f6c634300060c0033";

type UniFactoryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: UniFactoryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class UniFactory__factory extends ContractFactory {
  constructor(...args: UniFactoryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<UniFactory> {
    return super.deploy(overrides || {}) as Promise<UniFactory>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): UniFactory {
    return super.attach(address) as UniFactory;
  }
  override connect(signer: Signer): UniFactory__factory {
    return super.connect(signer) as UniFactory__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): UniFactoryInterface {
    return new utils.Interface(_abi) as UniFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): UniFactory {
    return new Contract(address, _abi, signerOrProvider) as UniFactory;
  }
}