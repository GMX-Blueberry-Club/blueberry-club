import { Behavior, combineArray, combineObject, O, replayLatest } from "@aelea/core"
import { $node, $text, component, eventElementTarget, INode, nodeEvent, style, styleBehavior, styleInline } from "@aelea/dom"
import { Route } from "@aelea/router"
import { $column, $icon, $row, layoutSheet, screenUtils } from "@aelea/ui-components"
import {
  AddressZero, formatFixed, intervalTimeMap, IPricefeed, IRequestPricefeedApi, ITrade, unixTimestampNow, ITradeOpen, BASIS_POINTS_DIVISOR, getNextAveragePrice,
  getNextLiquidationPrice, getMarginFees, STABLE_SWAP_FEE_BASIS_POINTS, STABLE_TAX_BASIS_POINTS, SWAP_FEE_BASIS_POINTS, TAX_BASIS_POINTS,
  getDenominator, USD_PERCISION, formatReadableUSD, timeSince, getPositionKey, IPositionIncrease,
  IPositionDecrease, getPnL, ARBITRUM_ADDRESS_STABLE, AVALANCHE_ADDRESS_STABLE, getFundingFee, filterNull, getTokenUsd, getLiquidationPrice,
  ITokenIndex, ITokenStable, ITokenInput, TradeStatus, LIMIT_LEVERAGE, div, readableDate, TRADE_CONTRACT_MAPPING, getTokenAmount, abs, IRequestAccountApi, CHAIN_ADDRESS_MAP, DEDUCT_FOR_GAS, getSafeMappedValue, getTokenDescription, getFeeBasisPoints,
} from "@gambitdao/gmx-middleware"

import { map, mergeArray, multicast, scan, skipRepeats, switchLatest, empty, now, awaitPromises, snapshot, zip, combine, tap, constant, periodic } from "@most/core"
import { colorAlpha, pallete, theme } from "@aelea/ui-components-theme"
import { $arrowsFlip, $infoTooltip, $IntermediatePromise, $ProfitLossText, $RiskLiquidator, $spinner, $txHashRef, invertColor } from "@gambitdao/ui-components"
import { CandlestickData, LineStyle, Time } from "lightweight-charts"
import { Stream } from "@most/types"
import { connectTradeReader, getErc20Balance, IPositionGetter, latestPriceFromExchanges } from "../logic/contract/trade"
import { $TradeBox, ITradeFocusMode, ITradeState, RequestTradeQuery } from "../components/trade/$TradeBox"
import { $ButtonToggle } from "../common/$Toggle"
import { $defaultTableContainer, $Table2 } from "../common/$Table2"
import { $Entry } from "./$Leaderboard"
import { $CandleSticks } from "../components/chart/$CandleSticks"
import { getNativeTokenDescription, resolveAddress } from "../logic/utils"
import { BrowserStore } from "../logic/store"
import { ContractTransaction } from "@ethersproject/contracts"
import { getContractAddress } from "../logic/common"
import { CHAIN, IWalletLink, IWalletName } from "@gambitdao/wallet-link"
import { Web3Provider } from "@ethersproject/providers"
import { ERC20__factory } from "@gambitdao/gbc-contracts"
import { $iconCircular } from "../elements/$common"
import { $Dropdown } from "../components/form/$Dropdown"
import { $ButtonSecondary } from "../components/form/$Button"
import { $caretDown } from "../elements/$icons"


export interface ITradeComponent {
  referralCode: string
  chainList: CHAIN[]
  tokenIndexMap: Partial<Record<CHAIN, ITokenIndex[]>>
  tokenStableMap: Partial<Record<CHAIN, ITokenStable[]>>
  store: BrowserStore<"ROOT.v1", "v1">
  parentRoute: Route

  walletLink: IWalletLink
  // defaultProvider: BaseProvider
  // provider: Web3Provider | BaseProvider

  accountTradeList: Stream<Promise<ITrade[]>>
  pricefeed: Stream<Promise<IPricefeed[]>>
}



type RequestTrade = {
  ctx: ContractTransaction
  state: ITradeState
  acceptablePrice: bigint
}



const timeFrameLablMap = {
  [intervalTimeMap.MIN5]: '5m',
  [intervalTimeMap.MIN15]: '15m',
  [intervalTimeMap.MIN60]: '1h',
  [intervalTimeMap.HR4]: 'h4',
  [intervalTimeMap.HR24]: '1d',
  [intervalTimeMap.DAY7]: '1w',
}


export const $Trade = (config: ITradeComponent) => component((
  [selectTimeFrame, selectTimeFrameTether]: Behavior<intervalTimeMap, intervalTimeMap>,
  [changeRoute, changeRouteTether]: Behavior<string, string>,

  [walletChange, walletChangeTether]: Behavior<IWalletName, IWalletName>,
  [changeNetwork, changeNetworkTether]: Behavior<CHAIN, CHAIN>,

  [changeInputToken, changeInputTokenTether]: Behavior<ITokenInput, ITokenInput>,
  [changeIndexToken, changeIndexTokenTether]: Behavior<ITokenIndex, ITokenIndex>,
  [changeCollateralToken, changeCollateralTokenTether]: Behavior<ARBITRUM_ADDRESS_STABLE | AVALANCHE_ADDRESS_STABLE, ARBITRUM_ADDRESS_STABLE | AVALANCHE_ADDRESS_STABLE>,

  [switchFocusMode, switchFocusModeTether]: Behavior<ITradeFocusMode, ITradeFocusMode>,
  [switchIsLong, switchIsLongTether]: Behavior<boolean, boolean>,
  [switchIsIncrease, switchIsIncreaseTether]: Behavior<boolean, boolean>,

  [changeCollateralDeltaUsd, changeCollateralDeltaUsdTether]: Behavior<bigint, bigint>,
  [changeSizeDeltaUsd, changeSizeDeltaUsdTether]: Behavior<bigint, bigint>,

  // [requestAccountTradeList, requestAccountTradeListTether]: Behavior<IAccountTradeListParamApi, IAccountTradeListParamApi>,
  [changeLeverage, changeLeverageTether]: Behavior<bigint, bigint>,
  [changeSlippage, changeSlippageTether]: Behavior<string, string>,

  [changeInputTokenApproved, changeInputTokenApprovedTether]: Behavior<boolean, boolean>,

  [enableTrading, enableTradingTether]: Behavior<boolean, boolean>,

  [switchTrade, switchTradeTether]: Behavior<INode, ITrade>,
  [requestTrade, requestTradeTether]: Behavior<RequestTradeQuery, RequestTradeQuery>,

) => {


  const tradeReader = connectTradeReader(config.walletLink.provider)
  const globalTradeReader = connectTradeReader(config.walletLink.defaultProvider)

  const executionFee = replayLatest(multicast(tradeReader.executionFee))

  const openTradeList = map(async list => (await list).filter((t): t is ITradeOpen => t.status === TradeStatus.OPEN), config.accountTradeList)

  const tradingStore = config.store.craete('trade', 'tradeBox')

  const timeFrameStore = tradingStore.craete('portfolio-chart-interval', intervalTimeMap.MIN60)

  const isTradingEnabledStore = tradingStore.craete('isTradingEnabled', false)
  const leverageStore = tradingStore.craete('leverage', LIMIT_LEVERAGE / 4n)
  const focusModeStore = tradingStore.craete('focusMode', ITradeFocusMode.collateral)
  const isLongStore = tradingStore.craete('isLong', true)
  const inputTokenStore = tradingStore.craete('inputToken', AddressZero as ITokenInput)
  const indexTokenStore = tradingStore.craete('indexToken', null as ITokenIndex | null)
  const collateralTokenStore = tradingStore.craete('collateralToken', null as ITokenStable | null)
  const isIncreaseStore = tradingStore.craete('isIncrease', true)
  const slippageStore = tradingStore.craete('slippage', '0.2')
  // const collateralRatioStore = tradingStore.craete('collateralRatio', 0)

  const isTradingEnabled = isTradingEnabledStore.storeReplay(enableTrading)
  const timeframe = timeFrameStore.storeReplay(selectTimeFrame)

  const isLong = isLongStore.storeReplay(mergeArray([map(t => t.isLong, switchTrade), switchIsLong]))
  const isIncrease = isIncreaseStore.storeReplay(switchIsIncrease)

  const focusMode = focusModeStore.storeReplay(switchFocusMode)
  const collateralDeltaUsd = replayLatest(changeCollateralDeltaUsd, 0n)
  const sizeDeltaUsd = replayLatest(changeSizeDeltaUsd, 0n)


  const slippage = slippageStore.storeReplay(changeSlippage)



  const inputToken: Stream<ITokenInput> = inputTokenStore.storeReplay(
    changeInputToken,
    combine((chain, token) => {
      if (token === AddressZero) {
        return token
      }

      const allTokens = [...config.tokenIndexMap[chain] || [], ...config.tokenStableMap[chain] || []]
      const matchedToken = allTokens?.find(t => t === token)

      return matchedToken || getSafeMappedValue(CHAIN_ADDRESS_MAP, chain, CHAIN.ARBITRUM).NATIVE_TOKEN
    }, config.walletLink.network)
  )

  const indexToken: Stream<ITokenIndex> = indexTokenStore.storeReplay(
    mergeArray([map(t => t.indexToken, switchTrade), changeIndexToken]),
    combine((chain, token) => {
      const matchedToken = config.tokenIndexMap[chain]?.find(t => t === token)

      return matchedToken || getSafeMappedValue(CHAIN_ADDRESS_MAP, chain, CHAIN.ARBITRUM).NATIVE_TOKEN
    }, config.walletLink.network)
  )

  const collateralTokenReplay: Stream<ITokenStable> = collateralTokenStore.storeReplay(
    mergeArray([map(t => t.collateralToken, switchTrade), changeCollateralToken]),
    combine((chain, token) => {
      const matchedToken = config.tokenStableMap[chain]?.find(t => t === token)

      return matchedToken || getSafeMappedValue(CHAIN_ADDRESS_MAP, chain, CHAIN.ARBITRUM).USDC
    }, config.walletLink.network)
  )

  const collateralToken: Stream<ITokenStable | ITokenIndex> = map(params => {
    return params.isLong ? params.indexToken : params.collateralTokenReplay
  }, combineObject({ isLong, indexToken, collateralTokenReplay }))


  const walletBalance = replayLatest(multicast(awaitPromises(combine(async (token, provider) => {
    if (provider instanceof Web3Provider) {
      const balanceAmount = await getErc20Balance(token, provider)
      if (token === AddressZero) {
        balanceAmount - DEDUCT_FOR_GAS
      }

      return balanceAmount
    }

    return 0n
  }, inputToken, config.walletLink.provider))))


  const inputTokenPrice = skipRepeats(tradeReader.getLatestPrice(inputToken))
  const indexTokenPrice = skipRepeats(multicast(switchLatest(map(token => latestPriceFromExchanges(token), indexToken))))
  const collateralTokenPrice = skipRepeats(tradeReader.getLatestPrice(collateralToken))


  const account = map(signer => {
    return signer ? signer.address : null
  }, config.walletLink.wallet)


  let latestKey = ''
  const positionKey = filterNull(map(params => {
    console.log(params)
    const collateralToken = params.isLong ? params.indexToken : params.collateralToken
    const address = params.account || AddressZero
    const key = getPositionKey(address, collateralToken, params.indexToken, params.isLong)

    if (latestKey === key) {
      return null
    }

    latestKey = key


    return { ...params, key, account: address, isLong: params.isLong, collateralToken }
  }, combineObject({ account, indexToken, collateralToken, isLong })))


  const keeperExecuteIncrease = globalTradeReader.executeIncreasePosition
  const keeperDecreaseIncrease = globalTradeReader.executeDecreasePosition
  const keeperCancelIncrease = globalTradeReader.cancelIncreasePosition
  const keeperCancelDecrease = globalTradeReader.executeDecreasePosition


  // const keeperExecuteIncrease = tradeReader.executeIncreasePosition // mapKeeperEvent(globalPositionRouterReader.listen<KeeperIncreaseRequest>('ExecuteIncreasePosition'))
  // const keeperDecreaseIncrease = tradeReader.executeDecreasePosition // mapKeeperEvent(globalPositionRouterReader.listen<KeeperDecreaseRequest>('ExecuteDecreasePosition'))
  // const keeperCancelIncrease = tradeReader.cancelIncreasePosition // mapKeeperEvent(globalPositionRouterReader.listen<KeeperIncreaseRequest>('CancelIncreasePosition'))
  // const keeperCancelDecrease = tradeReader.executeDecreasePosition // mapKeeperEvent(globalPositionRouterReader.listen<KeeperDecreaseRequest>('CancelDecreasePosition'))


  const adjustPosition = multicast(mergeArray([
    keeperExecuteIncrease,
    keeperDecreaseIncrease,
    keeperCancelIncrease,
    keeperCancelDecrease,
  ]))

  const positionChange: Stream<IPositionGetter> = replayLatest(multicast(tradeReader.vaultReader.run(combine(async (pos, vault) => {
    const positionAbstract = await vault.positions(pos.key)
    const [size, collateral, averagePrice, entryFundingRate, reserveAmount, realisedPnl, lastIncreasedTime] = positionAbstract
    const lastIncreasedTimeBn = lastIncreasedTime.toBigInt()

    return {
      ...pos,
      size: size.toBigInt(),
      collateral: collateral.toBigInt(),
      averagePrice: averagePrice.toBigInt(),
      entryFundingRate: entryFundingRate.toBigInt(),
      reserveAmount: reserveAmount.toBigInt(),
      realisedPnl: realisedPnl.toBigInt(),
      lastIncreasedTime: lastIncreasedTimeBn,
    }
  }, positionKey))))



  const updatePostion = filterNull(snapshot(
    (pos, update) => {
      if (pos.key !== update.key) {
        return null
      }

      return { ...pos, ...update }
    },
    positionChange,
    globalTradeReader.positionUpdateEvent
    // tradeReader.positionUpdateEvent
  ))


  const position = mergeArray([
    positionChange,
    updatePostion,
    filterNull(snapshot(
      (pos, update): IPositionGetter | null => {
        if (pos.key !== update.key) {
          return null
        }

        return {
          ...pos,
          size: 0n,
          collateral: 0n,
          averagePrice: 0n,
          entryFundingRate: 0n,
          reserveAmount: 0n,
          realisedPnl: 0n,
          lastIncreasedTime: 0n,
        }
      },
      positionChange,
      mergeArray([globalTradeReader.positionCloseEvent, globalTradeReader.positionLiquidateEvent])
      // mergeArray([tradeReader.positionCloseEvent, tradeReader.positionLiquidateEvent])
    ))
  ])

  const inputTokenWeight = tradeReader.getTokenWeight(inputToken)
  const inputTokenDebtUsd = tradeReader.getTokenDebtUsd(inputToken)

  const inputTokenDescription = combineArray((chain, address) => address === AddressZero ? getNativeTokenDescription(chain) : getTokenDescription(address), config.walletLink.network, inputToken)
  const indexTokenDescription = map((address) => getTokenDescription(address), indexToken)
  const collateralTokenDescription = map((address) => getTokenDescription(address), collateralToken)


  const walletBalanceUsd = combineArray((balance, price, tokenDesc) => getTokenUsd(balance, price, tokenDesc.decimals), walletBalance, inputTokenPrice, inputTokenDescription)

  const collateralTokenPoolInfo = replayLatest(multicast(tradeReader.getTokenPoolInfo(collateralToken)))


  const collateralDelta = map(params => {
    return getTokenAmount(params.collateralDeltaUsd, params.inputTokenPrice, params.inputTokenDescription.decimals)
  }, combineObject({ inputTokenPrice, inputTokenDescription, collateralDeltaUsd }))

  const sizeDelta = map(params => {
    return getTokenAmount(params.sizeDeltaUsd, params.indexTokenPrice, params.indexTokenDescription.decimals)
  }, combineObject({ indexTokenDescription, indexTokenPrice, sizeDeltaUsd }))


  const swapFee = replayLatest(multicast(skipRepeats(map((params) => {
    const inputAndIndexStable = params.inputTokenDescription.isStable && params.indexTokenDescription.isStable
    const swapFeeBasisPoints = inputAndIndexStable ? STABLE_SWAP_FEE_BASIS_POINTS : SWAP_FEE_BASIS_POINTS
    const taxBasisPoints = inputAndIndexStable ? STABLE_TAX_BASIS_POINTS : TAX_BASIS_POINTS

    const rsolvedInputAddress = resolveAddress(params.chain, params.inputToken)
    if (rsolvedInputAddress === params.collateralToken) {
      return 0n
    }

    const adjustedPnlDelta = params.position.size > 0n && abs(params.sizeDeltaUsd) > 0n
      ? getPnL(params.isLong, params.position.averagePrice, params.indexTokenPrice, params.position.size) * abs(params.sizeDeltaUsd) / params.position.size
      : 0n

    const amountUsd = abs(params.collateralDeltaUsd) + adjustedPnlDelta > 0n ? adjustedPnlDelta : 0n

    const usdgAmount = amountUsd * getDenominator(params.inputTokenDescription.decimals) / USD_PERCISION

    const feeBps0 = getFeeBasisPoints(
      params.inputTokenDebtUsd,
      params.inputTokenWeight,
      usdgAmount,
      swapFeeBasisPoints,
      taxBasisPoints,
      true,
      params.usdgSupply,
      params.totalTokenWeight
    )
    const feeBps1 = getFeeBasisPoints(
      params.collateralTokenPoolInfo.usdgAmount,
      params.collateralTokenPoolInfo.weight,
      usdgAmount,
      swapFeeBasisPoints,
      taxBasisPoints,
      false,
      params.usdgSupply,
      params.totalTokenWeight
    )

    const feeBps = feeBps0 > feeBps1 ? feeBps0 : feeBps1
    const addedSwapFee = feeBps ? amountUsd * feeBps / BASIS_POINTS_DIVISOR : 0n

    return addedSwapFee
  }, combineObject({
    collateralToken, inputToken, isIncrease, sizeDeltaUsd, isLong, collateralDeltaUsd, chain: config.walletLink.network,
    collateralTokenPoolInfo, usdgSupply: tradeReader.usdgSupply, totalTokenWeight: tradeReader.totalTokenWeight,
    position, inputTokenDescription, inputTokenWeight, inputTokenDebtUsd, indexTokenDescription, indexTokenPrice
  })))))

  const marginFee = map(size => getMarginFees(abs(size)), sizeDeltaUsd)
  const fundingFee = map(params => {
    return getFundingFee(params.position.entryFundingRate, params.collateralTokenPoolInfo.cumulativeRate, params.position.size)
  }, combineObject({ collateralTokenPoolInfo, position }))

  const leverage = leverageStore.store(mergeArray([
    changeLeverage,
    zip((params, stake) => {
      if (stake.averagePrice > 0n) {
        return div(stake.size + params.sizeDeltaUsd, stake.collateral + params.collateralDeltaUsd - params.fundingFee)
      }

      return leverageStore.getState()
    }, combineObject({ collateralDeltaUsd, sizeDeltaUsd, fundingFee }), position),
  ]))




  const tradeConfig = { focusMode, slippage, isLong, isIncrease, inputToken, collateralToken, indexToken, leverage, collateralDeltaUsd, sizeDeltaUsd }


  const averagePrice = map(params => {
    if (params.position.averagePrice === 0n) {
      return 0n
    }

    if (params.sizeDeltaUsd === 0n) {
      return params.position.averagePrice
    }

    const pnl = getPnL(params.isLong, params.position.averagePrice, params.indexTokenPrice, params.position.size)
    // const adjustedPnlDelta = pnl < 0n ? params.sizeDeltaUsd * pnl / stake.size : pnl
    // console.log(formatReadableUSD(adjustedPnlDelta))

    return getNextAveragePrice(params.isLong, params.position.size, params.indexTokenPrice, pnl, params.sizeDeltaUsd)
  }, combineObject({ position, isIncrease, indexTokenPrice, sizeDeltaUsd, isLong }))

  const liquidationPrice = map(params => {
    const stake = params.position
    if (params.position.averagePrice === 0n) {
      if (params.sizeDeltaUsd === 0n) {
        return 0n
      }
      return getLiquidationPrice(params.isLong, params.collateralDeltaUsd, params.sizeDeltaUsd, params.indexTokenPrice)
    }

    const pnl = getPnL(params.isLong, stake.averagePrice, params.indexTokenPrice, stake.size)
    const entryPrice = stake.averagePrice
    const price = getNextLiquidationPrice(params.isLong, stake.size, stake.collateral, entryPrice, stake.entryFundingRate, params.collateralTokenPoolInfo.cumulativeRate, pnl, params.sizeDeltaUsd, params.collateralDeltaUsd)

    return price
  }, combineObject({ position, isIncrease, collateralDeltaUsd, collateralTokenPoolInfo, sizeDeltaUsd, averagePrice, indexTokenPrice, indexTokenDescription, isLong }))


  const requestPricefeed = combineArray((chain, tokenAddress, interval): IRequestPricefeedApi => {
    const range = interval * 1000
    const to = unixTimestampNow()
    const from = to - range


    return { chain, interval, tokenAddress: resolveAddress(chain, tokenAddress), from, to }
  }, config.walletLink.network, indexToken, timeframe)

  // const selectedPricefeed = mergeArray([config.pricefeed, constant(null, requestPricefeed)])

  const requestTradeRow: Stream<RequestTrade[]> = switchLatest(awaitPromises(map(res => {
    return res.ctxQuery
      .then(ctx => {
        return now([{ ctx, state: res.state, acceptablePrice: res.acceptablePrice }])
      })
      .catch(err => empty())
  }, requestTrade)))


  const isInputTokenApproved = replayLatest(multicast(mergeArray([
    changeInputTokenApproved,
    awaitPromises(snapshot(async (collateralDeltaUsd, params) => {
      if (params.wallet === null) {
        console.warn(new Error('No wallet connected'))
        return false
      }

      // const erc20 = connectErc20(inputToken, map(w3p => , config.walletProvider))
      const c = ERC20__factory.connect(params.inputToken, params.wallet.signer)

      if (params.inputToken === AddressZero || !params.isIncrease) {
        return true
      }

      const contractAddress = getContractAddress(TRADE_CONTRACT_MAPPING, params.wallet.chain, 'Router')

      if (contractAddress === null) {
        return false
      }

      try {
        const allowedSpendAmount = (await c.allowance(params.wallet.address, contractAddress)).toBigInt()
        return allowedSpendAmount > collateralDeltaUsd
      } catch (err) {
        console.warn(err)
        return false
      }

    }, collateralDeltaUsd, combineObject({ wallet: config.walletLink.wallet, inputToken, isIncrease }))),
  ])))


  const $chartContainer = $column(style({
    // backgroundImage: `radial-gradient(at right center, ${pallete.background} 50%, transparent)`,
    position: 'relative',
    background: colorAlpha(pallete.background, 1.5)
  }))(
    screenUtils.isDesktopScreen
      ? O(
        style({
          position: 'absolute', flexDirection: 'column', inset: '120px 0 0 0', width: 'calc(50vw)', borderRight: `1px solid rgba(191, 187, 207, 0.15)`,
          display: 'flex'
        }),
        styleInline(map(interesction => {
          const target = interesction.target

          if (target instanceof HTMLElement) {
            return { inset: `${120 - Math.min(120, target.scrollTop)}px 0 0 0` }
          } else {
            throw new Error('scroll target is not an elemnt')
          }

        }, eventElementTarget('scroll', document.body.children[0])))
      )
      : O()
  )

  const requestAccountTradeList: Stream<IRequestAccountApi | null> = map(w3p => {
    if (w3p === null || config.chainList.indexOf(w3p.chain) === -1) {
      return null
    }

    return {
      account: w3p.address,
      chain: w3p.chain,
    }
  }, config.walletLink.wallet)


  const availableIndexLiquidityUsd = tradeReader.getAvailableLiquidityUsd(indexToken, collateralToken)


  const openTradeListQuery: Stream<Promise<ITradeOpen[]>> = mergeArray([
    combineArray(async (pos, listQuery) => {
      const tradeList = await listQuery

      if (pos.averagePrice === 0n && tradeList.length === 0) {
        return []
      }

      const trade = tradeList.find(t => t.key === pos.key) || null

      if (pos.averagePrice > 0n && trade === null) {
        const timestamp = unixTimestampNow()
        const syntheticUpdate = { ...pos, timestamp, realisedPnl: 0n, markPrice: pos.averagePrice, isLong: pos.isLong, __typename: 'UpdatePosition' }
        const newTrade = {
          ...pos,
          timestamp,
          updateList: [syntheticUpdate],
          increaseList: [], decreaseList: [],
          fee: 0n,
          status: TradeStatus.OPEN
        } as any as ITradeOpen

        return [newTrade, ...tradeList]
      }

      return pos.averagePrice === 0n
        ? tradeList.filter(t => t.key !== pos.key)
        : tradeList
    }, position, openTradeList)
  ])


  return [
    $container(
      $node(layoutSheet.spacingBig, style({ flex: 1, paddingBottom: screenUtils.isDesktopScreen ? '50px' : '8px', display: 'flex', flexDirection: screenUtils.isDesktopScreen ? 'column' : 'column-reverse' }))(

        filterNull(
          map(ev => {
            console.log(ev)
            return null
          }, adjustPosition)
        ) as Stream<any>,

        $column(layoutSheet.spacingSmall)(
          $TradeBox({
            ...config,

            trade: snapshot(async (list, pos) => {
              const trade = (await list).find(t => t.key === pos.key) || null


              return trade
            }, openTradeListQuery, position),
            // positionChange,
            pricefeed: config.pricefeed,

            tradeConfig,
            tradeState: {
              nativeTokenPrice: tradeReader.nativeTokenPrice,

              position,
              collateralTokenPoolInfo,
              isTradingEnabled,
              availableIndexLiquidityUsd,
              isInputTokenApproved,
              collateralDelta,
              sizeDelta,

              inputTokenPrice,
              indexTokenPrice,
              collateralTokenPrice,
              collateralTokenDescription,
              indexTokenDescription,
              inputTokenDescription,
              fundingFee,
              marginFee,
              swapFee,
              averagePrice,
              liquidationPrice,
              executionFee,
              walletBalance,
              walletBalanceUsd,
            }
          })({
            leverage: changeLeverageTether(),
            switchIsIncrease: switchIsIncreaseTether(),
            changeCollateralDeltaUsd: changeCollateralDeltaUsdTether(),
            changeSizeDeltaUsd: changeSizeDeltaUsdTether(),
            changeInputToken: changeInputTokenTether(),
            changeCollateralToken: changeCollateralTokenTether(),
            changeIndexToken: changeIndexTokenTether(),
            switchIsLong: switchIsLongTether(),
            changeRoute: changeRouteTether(),
            // changeCollateralRatio: changeCollateralRatioTether(),
            requestTrade: requestTradeTether(),
            changeSlippage: changeSlippageTether(),
            walletChange: walletChangeTether(),
            enableTrading: enableTradingTether(),
            approveInputToken: changeInputTokenApprovedTether(),
            changeNetwork: changeNetworkTether(),
            switchFocusMode: switchFocusModeTether(),
          }),
        ),

        screenUtils.isDesktopScreen ? $node() : empty(),

        switchLatest(combineArray((w3p) => {

          if (w3p === null) {
            return $column(style({ alignItems: 'center' }))(
              $text(style({ color: pallete.foreground }))(
                'Trade List'
              )
            )
          }



          return $IntermediatePromise({
            query: openTradeListQuery,
            $$done: map(res => {

              if (res.length === 0) {
                return $row(layoutSheet.spacingSmall, style({ placeContent: 'center' }))(
                  $text(style({ color: pallete.foreground, fontSize: '.75em' }))(
                    'No open positions'
                  )
                )
              }

              return $Table2<ITradeOpen>({
                dataSource: now(res),
                $rowContainer: screenUtils.isDesktopScreen
                  ? $row(layoutSheet.spacing, style({ padding: `2px 0` }))
                  : $row(layoutSheet.spacingSmall, style({ padding: `2px 0` })),
                $container: $column,
                columns: [
                  {
                    $head: $text('Entry'),
                    columnOp: O(style({ maxWidth: '50px', flexDirection: 'column' }), layoutSheet.spacingTiny),
                    $$body: map((pos) => {

                      return $Entry(w3p.chain, pos)
                    })
                  },
                  {
                    $head: $text('PnL'),
                    columnOp: O(layoutSheet.spacingTiny, style({ flex: 1, placeContent: 'flex-end' })),
                    $$body: map((pos) => {
                      const positionMarkPrice = tradeReader.getLatestPrice(now(pos.indexToken))
                      const cumulativeFee = tradeReader.getTokenCumulativeFunding(now(pos.collateralToken))

                      const pnl = map(params => {
                        const delta = getPnL(pos.isLong, pos.averagePrice, params.positionMarkPrice, pos.size)

                        return pos.realisedPnl + delta - pos.fee
                      }, combineObject({ positionMarkPrice, cumulativeFee }))


                      return $row(layoutSheet.spacingTiny)(
                        $ProfitLossText(pnl),
                        $infoTooltip(
                          $column(layoutSheet.spacingTiny)(
                            $text(style({}))('PnL breakdown'),
                            $column(
                              $row(layoutSheet.spacingTiny)(
                                $text(style({ color: pallete.foreground, flex: 1 }))('Deposit'),
                                $text(map(cumFee => {
                                  const entryFundingRate = pos.updateList[0].entryFundingRate
                                  const fee = getFundingFee(entryFundingRate, cumFee, pos.size)

                                  return formatReadableUSD(pos.collateral + fee)
                                }, cumulativeFee))
                              ),
                              $row(layoutSheet.spacingTiny)(
                                $text(style({ color: pallete.foreground, flex: 1 }))('Borrow Fee'),
                                $text(style({ color: pallete.negative }))(map(cumFee => {
                                  const fstUpdate = pos.updateList[0]
                                  const entryFundingRate = fstUpdate.entryFundingRate

                                  const fee = getFundingFee(entryFundingRate, cumFee, pos.size)
                                  return formatReadableUSD(fee)
                                }, cumulativeFee))
                              ),
                              $row(layoutSheet.spacingTiny)(
                                $text(style({ color: pallete.foreground, flex: 1 }))('Realised Pnl'),
                                $ProfitLossText(now(pos.realisedPnl))
                              ),
                              $row(layoutSheet.spacingTiny)(
                                $text(style({ color: pallete.foreground, flex: 1 }))('Open Pnl'),
                                $ProfitLossText(map(price => getPnL(pos.isLong, pos.averagePrice, price, pos.size), positionMarkPrice))
                              ),
                            )
                          )
                        ),
                      )
                    })
                  },
                  ...screenUtils.isDesktopScreen ? [{
                    $head: $text('Collateral'),
                    columnOp: O(layoutSheet.spacingTiny, style({ flex: .7, placeContent: 'flex-end' })),
                    $$body: map((pos: ITradeOpen) => {
                      const cumFee = tradeReader.getTokenCumulativeFunding(now(pos.collateralToken))

                      return $row(
                        $text(map(cumulative => {
                          const entryRate = pos.updateList[pos.updateList.length - 1].entryFundingRate

                          return formatReadableUSD(pos.collateral - getFundingFee(entryRate, cumulative, pos.size))
                        }, cumFee))
                      )
                    })
                  }] : [],
                  {
                    $head: $text('Size'),
                    columnOp: O(layoutSheet.spacingTiny, style({ flex: 1, placeContent: 'flex-end' })),
                    $$body: map(pos => {
                      const positionMarkPrice = tradeReader.getLatestPrice(now(pos.indexToken))

                      return $row(
                        $RiskLiquidator(pos, positionMarkPrice)({})
                      )
                    })
                  },
                  {
                    $head: $text('Switch'),
                    columnOp: style({ flex: 2, placeContent: 'center', maxWidth: '60px' }),
                    $$body: map((trade) => {

                      const clickSwitchBehavior = switchTradeTether(
                        nodeEvent('click'),
                        constant(trade),
                      )

                      const switchActiveStyle = styleBehavior(map(vpos => {
                        const isPosMatched = vpos?.key === trade.key

                        return isPosMatched ? { pointerEvents: 'none', opacity: '0.3' } : {}
                      }, position))


                      return $row(switchActiveStyle)(
                        clickSwitchBehavior(
                          style({ height: '28px', width: '28px' }, $iconCircular($arrowsFlip, pallete.horizon))
                        )
                      )
                    })
                  },
                ],
              })({})
            })
          })({})
        }, config.walletLink.wallet))


      ),

      $column(style({ flex: 1 }))(
        $chartContainer(
          $row(layoutSheet.spacing, style({ fontSize: '0.85em', zIndex: 5, position: 'absolute', padding: '8px', placeContent: 'center', alignItems: 'center' }))(
            screenUtils.isDesktopScreen
              ? $ButtonToggle({
                selected: timeframe,
                options: [
                  intervalTimeMap.MIN5,
                  intervalTimeMap.MIN15,
                  intervalTimeMap.MIN60,
                  intervalTimeMap.HR4,
                  intervalTimeMap.HR24,
                  intervalTimeMap.DAY7,
                ],
                $$option: map(option => {
                  // @ts-ignore
                  const newLocal: string = timeFrameLablMap[option]

                  return $text(newLocal)
                })
              })({ select: selectTimeFrameTether() })
              : $Dropdown({
                // $container: $row(style({ position: 'relative', alignSelf: 'center',  })),
                $selection: switchLatest(map((option) => {
                  // @ts-ignore
                  const newLocal: string = timeFrameLablMap[option]

                  return style({ padding: '8px', fontSize: '.75em', alignSelf: 'center' })(
                    $ButtonSecondary({
                      $content: $row(
                        $text(newLocal),
                        $icon({ $content: $caretDown, width: '14px', viewBox: '0 0 32 32' })
                      )
                    })({})
                  )
                }, timeframe)),
                value: {
                  value: timeframe,
                  // $container: $defaultSelectContainer(style({ minWidth: '100px', right: 0 })),
                  $$option: map((option) => {
                    // @ts-ignore
                    const label: string = timeFrameLablMap[option]

                    return $text(style({ fontSize: '0.85em' }))(label)
                  }),
                  list: [
                    intervalTimeMap.MIN5,
                    intervalTimeMap.MIN15,
                    intervalTimeMap.MIN60,
                    intervalTimeMap.HR4,
                    intervalTimeMap.HR24,
                    intervalTimeMap.DAY7,
                  ],
                }
              })({
                select: selectTimeFrameTether()
              }),
          ),


          $row(
            style({ position: 'relative', backgroundColor: theme.name === 'dark' ? colorAlpha(invertColor(pallete.message), .15) : pallete.horizon, borderBottom: `1px solid rgba(191, 187, 207, 0.15)` }),
            screenUtils.isDesktopScreen ? style({ flex: 3, maxHeight: '50vh' }) : style({ margin: '0 -15px', height: screenUtils.isDesktopScreen ? '50vh' : '40vh' })
          )(

            $IntermediatePromise({
              query: config.pricefeed,
              $$done: snapshot((tf, data) => {

                const fst = data[data.length - 1]
                const initialTick = {
                  open: formatFixed(fst.o, 30),
                  high: formatFixed(fst.h, 30),
                  low: formatFixed(fst.l, 30),
                  close: formatFixed(fst.c, 30),
                  time: fst.timestamp as Time
                }

                return $CandleSticks({
                  series: [
                    {
                      data: data.map(({ o, h, l, c, timestamp }) => {
                        const open = formatFixed(o, 30)
                        const high = formatFixed(h, 30)
                        const low = formatFixed(l, 30)
                        const close = formatFixed(c, 30)

                        return { open, high, low, close, time: timestamp as Time }
                      }),
                      seriesConfig: {
                        // priceFormat: {
                        //   type: 'custom',
                        //   formatter: (priceValue: BarPrice) => readableNumber(priceValue.valueOf())
                        // },
                        // lastValueVisible: false,

                        priceLineColor: pallete.foreground,
                        baseLineStyle: LineStyle.SparseDotted,

                        upColor: pallete.middleground,
                        borderUpColor: pallete.middleground,
                        wickUpColor: pallete.middleground,

                        downColor: 'transparent',
                        borderDownColor: colorAlpha(pallete.middleground, .5),
                        wickDownColor: colorAlpha(pallete.middleground, .5),
                      },
                      priceLines: [
                        map(val => {
                          if (val === 0n) {
                            return null
                          }

                          return {
                            price: formatFixed(val, 30),
                            color: pallete.middleground,
                            lineVisible: true,
                            crosshairMarkerRadius: 5,
                            lineWidth: 1,
                            axisLabelVisible: true,
                            title: `Entry`,
                            lineStyle: LineStyle.SparseDotted,
                          }
                        }, averagePrice),
                        map(val => {
                          if (val === 0n) {
                            return null
                          }

                          return {
                            price: formatFixed(val, 30),
                            color: pallete.indeterminate,
                            lineVisible: true,
                            crosshairMarkerRadius: 5,

                            lineWidth: 1,
                            axisLabelVisible: true,
                            title: `Liquidation`,
                            lineStyle: LineStyle.SparseDotted,
                          }
                        }, liquidationPrice)

                      ],
                      appendData: scan((prev: CandlestickData, nextPrice): CandlestickData => {
                        const marketPrice = formatFixed(nextPrice, 30)
                        const timeNow = unixTimestampNow()

                        const prevTimeSlot = Math.floor(prev.time as number / tf)

                        const nextTimeSlot = Math.floor(timeNow / tf)
                        const time = nextTimeSlot * tf as Time

                        const isNext = nextTimeSlot > prevTimeSlot

                        if (isNext) {
                          return {
                            open: marketPrice,
                            high: marketPrice,
                            low: marketPrice,
                            close: marketPrice,
                            time
                          }
                        }

                        return {
                          open: prev.open,
                          high: marketPrice > prev.high ? marketPrice : prev.high,
                          low: marketPrice < prev.low ? marketPrice : prev.low,
                          close: marketPrice,
                          time
                        }
                      }, initialTick, indexTokenPrice),
                    }
                  ],
                  containerOp: screenUtils.isDesktopScreen ? style({ position: 'absolute', inset: 0 }) : style({}),
                  chartConfig: {
                    rightPriceScale: {
                      visible: true,
                      autoScale: true,
                      entireTextOnly: true,
                      borderVisible: false,
                      scaleMargins: {
                        top: 0.15,
                        bottom: 0.15
                      }
                    },
                    timeScale: {
                      timeVisible: true,
                      secondsVisible: false,
                      borderVisible: false,
                      rightOffset: 13,
                      shiftVisibleRangeOnNewBar: true,
                    }
                  },
                })({
                  // crosshairMove: sampleChartCrosshair(),
                  // click: sampleClick()
                })
              }, timeframe)
            })({}),

          ),

          $column(style({ minHeight: '200px', flex: 1, position: 'relative' }))(
            switchLatest(map((w3p) => {

              const nullchain = w3p === null
              if (nullchain || config.chainList.indexOf(w3p.chain) === -1) {
                return $column(layoutSheet.spacingSmall, style({ flex: 1, alignItems: 'center', placeContent: 'center' }))(
                  $text(style({ fontSize: '1.5em' }))('Trade History'),
                  $text(style({ color: pallete.foreground, fontSize: '.75em' }))(
                    nullchain ? 'No wallet Connected' : 'Switch chain to see trading history'
                  )
                )
              }



              return $IntermediatePromise({
                query: openTradeListQuery,
                $$done: snapshot((pos, tradeList) => {
                  const trade = tradeList.find(t => t.key === pos.key)
                  const tokenDesc = getTokenDescription(pos.indexToken)
                  const route = pos.isLong ? `Long-${tokenDesc.symbol}` : `Short-${tokenDesc.symbol}/${getTokenDescription(pos.collateralToken).symbol}`

                  if (!trade) {
                    return $column(layoutSheet.spacingSmall, style({ flex: 1, alignItems: 'center', placeContent: 'center' }))(
                      $text(style({ fontSize: '1.5em' }))('Trade History'),
                      $text(style({ color: pallete.foreground, fontSize: '.75em' }))(
                        `no ${route} position open`
                      )
                    )
                  }


                  const initalList = trade ? [...trade.increaseList, ...trade.decreaseList] : []
                  return $Table2({
                    $rowContainer: screenUtils.isDesktopScreen
                      ? $row(layoutSheet.spacing, style({ padding: `2px 26px` }))
                      : $row(layoutSheet.spacingSmall, style({ padding: `2px 10px` })),
                    // headerCellOp: style({ padding: screenUtils.isDesktopScreen ? '15px 15px' : '6px 4px' }),
                    // cellOp: style({ padding: screenUtils.isDesktopScreen ? '4px 15px' : '6px 4px' }),
                    dataSource: mergeArray([
                      now(initalList) as Stream<(RequestTrade | IPositionIncrease | IPositionDecrease)[]>,
                      // constant(initalList, periodic(3000)),
                      requestTradeRow
                    ]),
                    $container: $defaultTableContainer(screenUtils.isDesktopScreen ? style({ flex: '1 1 0', minHeight: '100px' }) : style({})),
                    scrollConfig: {
                      insertAscending: true
                    },
                    columns: [
                      {
                        $head: $text('Time'),
                        columnOp: O(style({ maxWidth: '100px' })),

                        $$body: map((req) => {
                          const isKeeperReq = 'ctx' in req

                          const timestamp = isKeeperReq ? unixTimestampNow() : req.timestamp

                          return $column(layoutSheet.spacingTiny, style({ fontSize: '.65em' }))(
                            $text(timeSince(timestamp) + ' ago'),
                            $text(readableDate(timestamp)),
                          )
                        })
                      },
                      {
                        $head: $text('Action'),
                        columnOp: O(style({ flex: 1 })),

                        $$body: map((pos) => {
                          const $requestRow = $row(style({ alignItems: 'center' }))

                          if ('key' in pos) {
                            const direction = pos.__typename === 'IncreasePosition' ? '↑' : '↓'
                            const txHash = pos.id.split(':').slice(-1)[0]
                            return $row(layoutSheet.spacingSmall)(
                              $txHashRef(txHash, w3p.chain, $text(`${direction} ${formatReadableUSD(pos.price)}`))
                            )
                          }


                          const isIncrease = pos.state.isIncrease
                          return $row(layoutSheet.spacingSmall)(
                            $txHashRef(
                              pos.ctx.hash, w3p.chain,
                              $text(`${isIncrease ? '↑' : '↓'} ${formatReadableUSD(pos.acceptablePrice)} ${isIncrease ? '<' : '>'}`)
                            ),

                            switchLatest(mergeArray([
                              now($spinner),
                              map(req => {
                                const isRejected = req.__event.event === 'CancelIncreasePosition' || req.__event.event === 'CancelDecreasePosition'

                                const message = $text(`${isRejected ? `✖ ${formatReadableUSD(req.acceptablePrice)}` : `✔ ${formatReadableUSD(req.acceptablePrice)}`}`)

                                return $requestRow(
                                  $txHashRef(req.__event.transactionHash, w3p.chain, message),
                                  $infoTooltip('transaction was sent, keeper will execute the request, the request will either be executed or rejected'),
                                )
                              }, adjustPosition),
                            ]))
                          )

                        })
                      },
                      ...screenUtils.isDesktopScreen
                        ? [
                          {
                            $head: $text('PnL Realised'),
                            columnOp: O(style({ flex: .5, placeContent: 'flex-end', textAlign: 'right', alignItems: 'center' })),

                            $$body: map((req: RequestTrade | IPositionIncrease | IPositionDecrease) => {
                              if ('ctx' in req) {
                                const fee = getMarginFees(req.state.sizeDeltaUsd)

                                return $text(formatReadableUSD(fee))
                              }

                              const update = trade.updateList.find(ev => req.timestamp > ev.timestamp)
                              update?.realisedPnl

                              // const adjustmentPnl = div(req.sizeDelta * pnl, params.position.size) / BASIS_POINTS_DIVISOR

                              return $text(formatReadableUSD(req.fee))
                            })
                          }
                        ] : [],
                      {
                        $head: $text('Collateral change'),
                        columnOp: O(style({ flex: .7, placeContent: 'flex-end', textAlign: 'right', alignItems: 'center' })),

                        $$body: map((req) => {
                          const isKeeperReq = 'ctx' in req
                          const delta = isKeeperReq ? req.state.collateralDeltaUsd : req.collateralDelta

                          return $text(formatReadableUSD(delta))
                        })
                      },
                      {
                        $head: $text('Size change'),
                        columnOp: O(style({ flex: .7, placeContent: 'flex-end', textAlign: 'right', alignItems: 'center' })),
                        $$body: map((req) => {
                          const isKeeperReq = 'ctx' in req
                          const delta = isKeeperReq ? req.state.sizeDeltaUsd : req.sizeDelta

                          return $text(formatReadableUSD(delta))
                        })
                      },
                    ]
                  })({})
                }, position)
              })({

              })

            }, config.walletLink.wallet))
          ),
        ),
      )
    ),

    {
      requestPricefeed,
      requestAccountTradeList,
      changeRoute,
      walletChange,
      changeNetwork
    }
  ]
})




// const filterPositionChange = <T extends IAbstractPositionIdentifier>(s: Stream<T>) => filterNull(combine((key, ev: T): T | null => key === ev.key ? ev : null, positionKey, s))

const $container = $node(
  style({
    fontSize: '1.1rem',
    fontFeatureSettings: '"tnum" on,"lnum" on',
    fontFamily: `-apple-system,BlinkMacSystemFont,Trebuchet MS,Roboto,Ubuntu,sans-serif`,
    display: 'flex',
    ...screenUtils.isDesktopScreen
      ? { flexDirection: 'row-reverse', gap: '80px' }
      : { flexDirection: 'column' }
    // fontFamily: '-apple-system,BlinkMacSystemFont,Trebuchet MS,Roboto,Ubuntu,sans-serif'
  })
)

const logStream = tap(x => console.log(x))


