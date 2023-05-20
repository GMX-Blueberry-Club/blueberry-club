import { CHAIN } from "@gambitdao/const"
import {
  AddressZero, TOKEN_DESCRIPTION_MAP,
  ITokenDescription, TOKEN_ADDRESS_TO_SYMBOL, ITokenInput, ITokenTrade, CHAIN_ADDRESS_MAP, CHAIN_NATIVE_TO_SYMBOL, getSafeMappedValue, getMappedValue
} from "@gambitdao/gmx-middleware"






export function resolveAddress(chain: CHAIN, indexToken: ITokenInput): ITokenTrade {
  if (indexToken === AddressZero) {
    return getSafeMappedValue(CHAIN_ADDRESS_MAP, chain, CHAIN.ARBITRUM).NATIVE_TOKEN
  }

  const contractAddressMap = getSafeMappedValue(TOKEN_ADDRESS_TO_SYMBOL, indexToken, indexToken)

  if (contractAddressMap === null) {
    throw new Error(`Token ${indexToken} does not exist`)
  }

  return indexToken
}
