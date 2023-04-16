import { combineArray, fromCallback, replayLatest } from "@aelea/core"
import { awaitPromises, constant, fromPromise, map, mergeArray, multicast, now, switchLatest } from "@most/core"
import { Stream } from "@most/types"
import { BrowserProvider, JsonRpcSigner, Provider } from "ethers"
import { eip1193ProviderEventFn } from "./common.js"
import { metamaskQuery, walletConnect } from "./provider.js"


export interface IWalletState {
  walletName: IWalletName
  address: string
  provider: Provider
  chain: number
  signer: Promise<JsonRpcSigner>
}


export interface IWalletLink {
  network: Stream<number>
  provider: Stream<Provider | BrowserProvider>
  defaultProvider: Stream<Provider>

  wallet: Stream<IWalletState | null>
}

export enum IWalletName {
  none = 'none',
  metamask = 'metamask',
  walletConnect = 'walletconnect'
}




interface IWalletLinkConfig {
  globalProviderMap: Partial<Record<number, Provider>>
  defaultGlobalChain: number
}


// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md
// walletconnect chaining chain issue https://github.com/WalletConnect/walletconnect-monorepo/issues/612
// attempting to manage wallet connection and event flow
export function initWalletLink(
  config: IWalletLinkConfig,
  walletName: Stream<IWalletName>,
  networkChange: Stream<number> = now(config.defaultGlobalChain),
): IWalletLink {
  const fallbackProvider = config.globalProviderMap[config.defaultGlobalChain]

  if (!fallbackProvider) {
    throw new Error('no Default Provider configured')
  }


  const wallet: Stream<IWalletState | null> = replayLatest(multicast(switchLatest(awaitPromises(combineArray(async (metamask, name) => {
    if (name === IWalletName.none) {
      return now(null)
    }

    const isWc = name === IWalletName.walletConnect
    const wp = isWc ? walletConnect : metamask!
    const [address]: string[] = await wp.request({ method: 'eth_accounts' }) as any
    const chain = Number(await wp.request({ method: 'eth_chainId' }))

    if (!address) {
      return now(null)
    }

    const prov: BrowserProvider = new BrowserProvider(wp, chain)

    const state: IWalletState = {
      walletName: name,
      address,
      provider: prov,
      chain: chain,
      signer: prov.getSigner(),
    }

    // WalletConnet doesn't emit standart disconnect
    const disconnect = isWc
      ? fromCallback(cb => walletConnect.on('disconnect', cb))
      : eip1193ProviderEventFn(wp, 'disconnect')

    const walletNetworkChange = awaitPromises(map(async id => {
      const chainId = Number(id)
      const w3p = new BrowserProvider(wp, chainId)
      document.location.reload()
      return { ...state, provider: w3p, chain: chainId }
    }, eip1193ProviderEventFn(wp, 'chainChanged')))

    const nullWallet = constant(null, disconnect)

    const accountChange = map(([account]) => {
      if (!account) {
        return null
      }

      return { ...state, address: account }
    }, eip1193ProviderEventFn(wp, 'accountsChanged'))

    return mergeArray([now(state), walletNetworkChange, accountChange, nullWallet])
  }, fromPromise(metamaskQuery), walletName)))))


  const defaultProvider = replayLatest(multicast(switchLatest(map((chain) => {
    const p = config.globalProviderMap[chain] || fallbackProvider

    const newLocal = p.getNetwork()
    const networkEvent = fromPromise(newLocal)

    return constant(p, networkEvent)
  }, networkChange))))

  const provider = replayLatest(multicast(combineArray((fbProvider, w3p) => {
    if (w3p) {
      return w3p.provider
    }

    return fbProvider
  }, defaultProvider, wallet)))

  const network: Stream<number> = replayLatest(multicast(awaitPromises(map(async p => Number((await p.getNetwork()).chainId), provider))))

  return { network, wallet, provider, defaultProvider }
}


