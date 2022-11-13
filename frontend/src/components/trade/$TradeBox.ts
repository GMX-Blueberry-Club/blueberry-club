import { Behavior, combineArray, combineObject, O, replayLatest } from "@aelea/core"
import { component, INode, $element, attr, style, $text, nodeEvent, stylePseudo, $node, styleBehavior, motion, MOTION_NO_WOBBLE } from "@aelea/dom"
import { $row, layoutSheet, $icon, $column, state, screenUtils, $TextField, $NumberTicker } from "@aelea/ui-components"
import { colorAlpha, pallete } from "@aelea/ui-components-theme"
import {
  ARBITRUM_ADDRESS_LEVERAGE, AddressZero, TOKEN_DESCRIPTION_MAP, CHAIN_TOKEN_ADDRESS_TO_SYMBOL, ARBITRUM_ADDRESS, formatFixed, readableNumber,
  TradeAddress, TOKEN_SYMBOL, parseFixed, formatReadableUSD, BASIS_POINTS_DIVISOR,
  ITrade, IVaultPosition, IChainParamApi, USD_DECIMALS, getTokenAmount, TokenDescription, MAX_LEVERAGE, bnDiv, replayState,
  div, StateStream, getPnL, MIN_LEVERAGE, formatToBasis, ARBITRUM_ADDRESS_STABLE, AVALANCHE_ADDRESS_STABLE, AVALANCHE_ADDRESS_LEVERAGE, getDeltaPercentage, isTradeSettled
} from "@gambitdao/gmx-middleware"
import { $alertIcon, $ButtonToggle, $infoTooltip, $tokenIconMap, $tokenLabelFromSummary, $Tooltip } from "@gambitdao/ui-components"
import { IWalletLink } from "@gambitdao/wallet-link"
import { merge, multicast, mergeArray, now, snapshot, map, switchLatest, filter, skipRepeats, empty, combine, fromPromise, constant, sample, startWith, skipRepeatsWith } from "@most/core"
import { Stream } from "@most/types"
import { $Slider } from "../$Slider"
import { $ButtonPrimary, $ButtonSecondary } from "../form/$Button"
import { $Dropdown, $defaultSelectContainer } from "../form/$Dropdown"
import { $card } from "../../elements/$common"
import { $caretDown } from "../../elements/$icons"
import { USE_CHAIN } from "@gambitdao/gbc-middleware"
import { CHAIN_NATIVE_TO_ADDRESS, getTokenDescription } from "./utils"
import { IEthereumProvider } from "eip1193-provider"
import { $IntermediateConnectButton } from "../../components/$ConnectAccount"
import { WALLET } from "../../logic/provider"
import { BrowserStore } from "../../logic/store"
import { connectVault, getErc20Balance } from "../../logic/contract/trade"
import { MouseEventParams } from "lightweight-charts"
import { $TradePnlHistory } from "./$TradePnlHistory"



export interface ITradeState {
  vaultPosition: IVaultPosition | null
  collateralDeltaUsd: bigint
  inputTokenPrice: bigint
  collateralTokenPrice: bigint
  // availableLiquidityUsd: bigint
  indexTokenPrice: bigint
  walletBalance: bigint

  swapFee: bigint
  marginFee: bigint
  executionFee: bigint
  fee: bigint

  inputTokenDescription: TokenDescription
  indexTokenDescription: TokenDescription
  collateralTokenDescription: TokenDescription

  averagePrice: bigint | null
  liquidationPrice: bigint | null

  // minCollateralRatio: Stream<bigint>

  // validationError: Stream<string | null>
}

export interface ITradeParams {
  trade: ITrade | null
  isLong: boolean

  inputToken: TradeAddress
  shortCollateralToken: ARBITRUM_ADDRESS_STABLE | AVALANCHE_ADDRESS_STABLE
  indexToken: ARBITRUM_ADDRESS_LEVERAGE | AVALANCHE_ADDRESS_LEVERAGE
  isIncrease: boolean

  collateralRatio: bigint
  leverage: bigint
  collateralDelta: bigint
  sizeDelta: bigint

  slippage: string
}





export interface ITradeRequest extends ITradeParams, ITradeState {

}

interface ITradeBox {
  store: BrowserStore<string, "ROOT.GBC-TRADING">
  chain: IChainParamApi['chain'],

  tradeParams: StateStream<ITradeParams> // ITradeParams
  state: StateStream<ITradeState>

  walletLink: IWalletLink
  walletStore: state.BrowserStore<WALLET, "walletStore">
}


export const $TradeBox = ({ chain, state, tradeParams, walletLink, walletStore, store }: ITradeBox) => component((
  [switchIsLong, switchIsLongTether]: Behavior<boolean, boolean>,

  [inputCollateral, inputCollateralTether]: Behavior<INode, bigint>,
  [inputSizeDelta, inputSizeDeltaTether]: Behavior<INode, bigint>,

  [changeInputToken, changeInputTokenTether]: Behavior<TradeAddress, TradeAddress>,
  [changeCollateralToken, changeCollateralTokenTether]: Behavior<ARBITRUM_ADDRESS_STABLE | AVALANCHE_ADDRESS_STABLE, ARBITRUM_ADDRESS_STABLE | AVALANCHE_ADDRESS_STABLE>,
  [changeIndexToken, changeIndexTokenTether]: Behavior<TradeAddress, TradeAddress>,

  [switchIsIncrease, switchisIncreaseTether]: Behavior<boolean, boolean>,
  [slideCollateralRatio, slideCollateralRatioTether]: Behavior<number, bigint>,
  [slideLeverage, slideLeverageTether]: Behavior<number, bigint>,
  [changeSlippage, changeSlippageTether]: Behavior<string, string>,

  [walletChange, walletChangeTether]: Behavior<IEthereumProvider | null, IEthereumProvider | null>,
  [requestTrade, requestTradeTether]: Behavior<PointerEvent, ITradeRequest>,

  [crosshairMove, crosshairMoveTether]: Behavior<MouseEventParams, MouseEventParams>,
  [clickReset, clickResetTether]: Behavior<any, any>,


) => {

  const vault = connectVault(walletLink.provider)


  const tradeState: Stream<ITradeRequest> = replayState({ ...state, ...tradeParams })


  const validationError = map((params) => {

    if (params.leverage > MAX_LEVERAGE) {
      return `Leverage exceeds ${formatToBasis(MAX_LEVERAGE)}x`
    }

    if (params.isIncrease) {
      if (params.collateralDelta > params.walletBalance) {
        return `Not enough ${params.inputTokenDescription.symbol} in connected account`
      }

      if (params.leverage < MIN_LEVERAGE) {
        return `Leverage below 1.1x`
      }

    }

    if (!params.isIncrease && !params.vaultPosition) {
      return `No ${params.indexTokenDescription.symbol} position to reduce`
    }

    if (params.vaultPosition && !params.isIncrease) {

      const totalSize = params.vaultPosition.size - params.sizeDelta
      const pnl = getPnL(params.isLong, params.vaultPosition.averagePrice, params.indexTokenPrice, totalSize)

      const netCollateral = params.vaultPosition.collateral + pnl

      if (params.collateralDeltaUsd + params.fee > netCollateral) {
        return `Exceeding liquidation price`
      }
    }

    return null
  }, tradeState)


  const ratioAdjustments = mergeArray([sample(slideCollateralRatio, state.walletBalance), slideCollateralRatio])

  const slideCollateral = snapshot((params, ratio) => {
    if (params.isIncrease) {
      return params.walletBalance * ratio / BASIS_POINTS_DIVISOR
    }

    if (!params.vaultPosition) {
      return 0n
    }

    // const positionCollateral = params.vaultPosition.collateral * (BASIS_POINTS_DIVISOR - DEPOSIT_FEE) / BASIS_POINTS_DIVISOR
    const positionCollateralUsd = params.vaultPosition.collateral / BASIS_POINTS_DIVISOR
    const removeCollateral = positionCollateralUsd * ratio
    const amount = getTokenAmount(removeCollateral, params.inputTokenPrice, params.inputTokenDescription)

    return amount
  }, tradeState, ratioAdjustments)


  const changeSizeByRatio = snapshot((params, leverage) => {
    const collateral = params.collateralDeltaUsd + (params.vaultPosition?.collateral || 0n)
    const size = collateral * leverage / BASIS_POINTS_DIVISOR

    if (!params.vaultPosition) {
      return size
    }

    const currentMultiplier = div(params.vaultPosition.size, collateral)

    if (params.isIncrease) {

      if (currentMultiplier >= leverage) {
        return 0n
      }

      return size - params.vaultPosition.size
    }

    const sizeM = (params.vaultPosition.collateral - params.collateralDeltaUsd) * leverage / BASIS_POINTS_DIVISOR

    return params.vaultPosition.size - sizeM

  }, tradeState, slideLeverage)

  const sizeChangeEffect = mergeArray([
    constant(0n, clickReset),
    inputSizeDelta,
    sample(tradeParams.sizeDelta, state.collateralDeltaUsd)
  ])

  const initialLeverage = map(pos => {
    if (!pos) {
      return 0n
    }

    return div(pos.size, pos.collateral)
  }, state.vaultPosition)



  const pnlCrossHairTimeChange = replayLatest(multicast(startWith(null, skipRepeatsWith(((xsx, xsy) => xsx.time === xsy.time), crosshairMove))))

  const pnlCrossHairTime = map((cross: MouseEventParams) => {
    if (cross) {
      return cross.seriesPrices.values().next().value
    }

    return null
  }, pnlCrossHairTimeChange)

  const BOX_SPACING = '18px'

  const MAX_LEVERAGE_NORMAL = formatToBasis(MAX_LEVERAGE)

  const clickResetVal = constant(0n, clickReset)
  return [
    $column(

      $card(screenUtils.isDesktopScreen ? layoutSheet.spacing : layoutSheet.spacing, style({ border: `1px solid ${colorAlpha(pallete.foreground, .15)}`, padding: `${BOX_SPACING} ${BOX_SPACING} 0`, margin: screenUtils.isMobileScreen ? '0 10px' : '' }))(
        $column(layoutSheet.spacing)(
          $row(layoutSheet.spacingSmall, style({ position: 'relative', alignItems: 'center' }))(

            // (
            //   // styleBehavior(map(isIncrease => isIncrease === 0 ? {} : { color: pallete.foreground, backgroundColor: 'transparent' }, state.focusFactor)),
            //   focusCollateralTether(nodeEvent('focus'))
            // )
            $field(
              O(
                map(node =>
                  merge(
                    now(node),
                    filter(() => false, snapshot((params, val) => {
                      if (val === 0n) {
                        node.element.value = ''
                        return
                      }

                      node.element.value = formatFixed(val, params.isIncrease ? params.inputTokenDescription.decimals : params.inputTokenDescription.decimals).toString()
                    }, tradeState, mergeArray([slideCollateral, clickResetVal])))
                  )
                ),
                switchLatest
              ),

              inputCollateralTether(nodeEvent('input'), snapshot((params, inputEvent) => {
                const target = inputEvent.currentTarget

                if (!(target instanceof HTMLInputElement)) {
                  throw new Error('Target is not type of input')
                }

                const decimals = params.isIncrease ? params.inputTokenDescription.decimals : params.indexTokenDescription.decimals
                return BigInt(parseFixed(target.value.replace(/(\+|-)/, ''), decimals))
              }, tradeState)),
            )(),

            // $label(layoutSheet.spacingSmall, style({ alignItems: 'center', flexDirection: 'row', fontSize: '0.75em' }))(
            //   $Checkbox({
            //     value: map(x => !x, tradeParams.isIncrease)
            //   })({
            //     check: switchisIncreaseTether(map(x => !x))
            //   }),
            //   $text('Reduce'),
            // ),

            $ButtonToggle({
              selected: tradeParams.isIncrease,
              options: [
                false,
                true,
              ],
              $$option: map(option => {
                return $text(style({ fontSize: '0.85em' }))(option ? 'Increase' : 'Reduce')
              })
            })({ select: switchisIncreaseTether() }),

            $Dropdown<TradeAddress>({
              $container: $row(style({ position: 'relative', alignSelf: 'center' })),
              $selection: $row(style({ alignItems: 'center', cursor: 'pointer' }))(
                switchLatest(map(option => {
                  const symbol = option === CHAIN_NATIVE_TO_ADDRESS[USE_CHAIN]
                    ? TOKEN_SYMBOL.WETH
                    : CHAIN_TOKEN_ADDRESS_TO_SYMBOL[option === AddressZero ? CHAIN_NATIVE_TO_ADDRESS[USE_CHAIN] : option]

                  return $icon({
                    $content: $tokenIconMap[symbol],
                    svgOps: styleBehavior(map(isIncrease => ({ fill: isIncrease ? pallete.message : pallete.indeterminate }), tradeParams.isIncrease)),
                    width: '34px', viewBox: '0 0 32 32'
                  })
                }, tradeParams.inputToken)),
                $icon({ $content: $caretDown, width: '14px', svgOps: style({ marginTop: '3px', marginLeft: '5px' }), viewBox: '0 0 32 32' }),
              ),
              value: {
                value: tradeParams.inputToken,
                $container: $defaultSelectContainer(style({ minWidth: '300px', right: 0 })),
                $$option: combine(({ w3p, account }, option) => {
                  const symbol = option === CHAIN_NATIVE_TO_ADDRESS[USE_CHAIN]
                    ? TOKEN_SYMBOL.WETH
                    : CHAIN_TOKEN_ADDRESS_TO_SYMBOL[option === AddressZero ? CHAIN_NATIVE_TO_ADDRESS[USE_CHAIN] : option]
                  const tokenDesc = TOKEN_DESCRIPTION_MAP[symbol]


                  const balanceAmount = fromPromise(getErc20Balance(option, w3p, account))

                  return $row(style({ placeContent: 'space-between', flex: 1 }))(
                    $tokenLabelFromSummary(tokenDesc),
                    $text(map(bn => readableNumber(formatFixed(bn, tokenDesc.decimals)), balanceAmount))
                  )
                }, combineObject({ w3p: walletLink.provider, account: walletLink.account })),
                list: [
                  AddressZero,
                  ARBITRUM_ADDRESS.NATIVE_TOKEN,
                  ARBITRUM_ADDRESS.LINK,
                  ARBITRUM_ADDRESS.UNI,
                  ARBITRUM_ADDRESS.WBTC,
                  ARBITRUM_ADDRESS.USDC,
                  ARBITRUM_ADDRESS.USDT,
                  ARBITRUM_ADDRESS.DAI,
                  ARBITRUM_ADDRESS.FRAX,
                  ARBITRUM_ADDRESS.MIM,
                ],
              }
            })({
              select: changeInputTokenTether()
            }),
          ),
          $row(layoutSheet.spacingSmall, style({ alignItems: 'center', placeContent: 'stretch' }))(
            $hintInput(
              now(`Collateral`),
              'The amount you will deposit to open a leverage position',
              map(pos => formatReadableUSD(pos?.collateral || 0n), state.vaultPosition),
              combineArray(params => {

                const posCollateral = params.vaultPosition?.collateral || 0n

                if (params.isIncrease) {
                  const totalCollateral = posCollateral + params.collateralDeltaUsd
                  const collateralUsd = formatReadableUSD(totalCollateral - params.fee)

                  return collateralUsd
                }

                if (!params.vaultPosition) {
                  return formatReadableUSD(0n)
                }

                const pnl = getPnL(params.isLong, params.vaultPosition.averagePrice, params.indexTokenPrice, params.vaultPosition.size)
                const adjustedPnlDelta = pnl < 0n ? pnl * params.sizeDelta / params.vaultPosition.size : 0n
                const netCollateral = posCollateral - params.collateralDeltaUsd + adjustedPnlDelta

                return formatReadableUSD(netCollateral)
              }, tradeState)
            ),

            $node(style({ flex: 1 }))(),

            O(stylePseudo(':hover', { color: pallete.primary }))(
              $row(layoutSheet.spacingTiny, style({ fontSize: '0.75em' }))(
                $text(style({ color: pallete.foreground }))(`Balance`),
                $text(combineArray((tokenDesc, balance) => {

                  return readableNumber(formatFixed(balance, tokenDesc.decimals)).toString()
                }, state.inputTokenDescription, state.walletBalance)),
              ),
            ),
          ),
        ),

        style({ margin: `0 -${BOX_SPACING}` })(
          $Slider({
            value: map(lm => {
              if (lm === null) {
                return 0
              }

              return bnDiv(lm, BASIS_POINTS_DIVISOR)
            }, tradeParams.collateralRatio),
            color: map(isIncrease => isIncrease ? pallete.middleground : pallete.indeterminate, tradeParams.isIncrease),
            step: 0.01,
            disabled: map(params => !params.isIncrease && params.vaultPosition === null, tradeState),
            // min: map(n => formatBasis(n), state.minCollateralRatio),
            max: map(params => {
              if (params.isIncrease) {
                return 1
              }

              if (!params.vaultPosition) {
                return 0
              }

              const minWithdraw = div(params.vaultPosition.size, MAX_LEVERAGE)
              const maxWithdraw = params.vaultPosition.collateral - minWithdraw // - state.fee

              return bnDiv(maxWithdraw, params.vaultPosition.collateral)
            }, tradeState),
            thumbText: map(n => Math.round(n * 100) + '\n%')
          })({
            change: slideCollateralRatioTether(
              map(ratio => {
                const leverageRatio = BigInt(Math.floor(Math.abs(ratio) * Number(BASIS_POINTS_DIVISOR)))

                return leverageRatio
              }),
              multicast
            )
          })
        ),

        $column(layoutSheet.spacing)(
          $row(layoutSheet.spacingSmall, style({ alignItems: 'center' }))(


            $field(
              O(
                map(node =>
                  merge(
                    now(node),
                    filter(() => false, map(val => {

                      if (val === 0n) {
                        node.element.value = ''
                        return
                      }

                      // const valF = formatFixed(val.outputAmountUsd, val.outputTokenDescription.decimals)
                      const valF = formatFixed(val, USD_DECIMALS)
                      // applying by setting `HTMLInputElement.value` imperatively(only way known to me)
                      node.element.value = valF.toString()

                    }, mergeArray([clickResetVal, changeSizeByRatio])))
                  )
                ),
                switchLatest
              ),
              inputSizeDeltaTether(nodeEvent('input'), snapshot((tokenDesc, inputEvent) => {
                const target = inputEvent.currentTarget

                if (!(target instanceof HTMLInputElement)) {
                  throw new Error('Target is not type of input')
                }

                return BigInt(parseFixed(target.value.replace(/(\+|-)/, ''), USD_DECIMALS))
              }, state.indexTokenDescription))
            )(),

            // $Dropdown<boolean>({
            //   $container: $row(style({ position: 'relative' })),
            //   $selection: $row(style({ alignItems: 'center', cursor: 'pointer' }))(
            //     switchLatest(map(option => {
            //       return $row(layoutSheet.spacingTiny, style({ alignItems: 'center' }))(
            //         $icon({ $content: option ? $bull : $bear, fill: option ? pallete.positive : pallete.negative, width: '14px', viewBox: '0 0 32 32' }),
            //         $text(style({ fontSize: '.75em' }))(option ? 'Long' : 'Short'),
            //       )
            //     }, tradeParams.isLong)),
            //     $icon({ $content: $caretDown, width: '14px', svgOps: style({ marginTop: '3px' }), viewBox: '0 0 32 32' }),
            //   ),
            //   value: {
            //     value: tradeParams.isLong,
            //     $container: $defaultSelectContainer(style({ minWidth: '100px' })),
            //     $$option: map(option => {
            //       return $row(layoutSheet.spacingSmall, style({ alignItems: 'center' }))(
            //         $icon({ $content: option ? $bull : $bear, fill: option ? pallete.positive : pallete.negative, width: '18px', viewBox: '0 0 32 32' }),
            //         $text(option ? 'Long' : 'Short'),
            //       )
            //     }),
            //     list: [
            //       true,
            //       false
            //     ],
            //   }
            // })({
            //   select: switchIsLongTether()
            // }),

            $ButtonToggle({
              selected: tradeParams.isLong,
              options: [
                false,
                true,
              ],
              $$option: map(option => {
                return $text(style({ fontSize: '0.85em' }))(option ? 'Long' : 'Short')
              })
            })({ select: switchIsLongTether() }),

            $Dropdown<TradeAddress>({
              $container: $row(style({ position: 'relative', alignSelf: 'center' })),
              $selection: $row(style({ alignItems: 'center', cursor: 'pointer' }))(
                switchLatest(map(option => {
                  const tokenDesc = TOKEN_DESCRIPTION_MAP[CHAIN_TOKEN_ADDRESS_TO_SYMBOL[option]]

                  return $icon({ $content: $tokenIconMap[tokenDesc.symbol], width: '34px', viewBox: '0 0 32 32' })
                }, tradeParams.indexToken)),
                $icon({ $content: $caretDown, width: '14px', svgOps: style({ marginTop: '3px', marginLeft: '5px' }), viewBox: '0 0 32 32' }),
              ),
              value: {
                value: tradeParams.indexToken,
                $container: $defaultSelectContainer(style({ minWidth: '300px', right: 0 })),
                $$option: snapshot((isLong, option) => {
                  const tokenDesc = option === AddressZero ? TOKEN_DESCRIPTION_MAP.ETH : TOKEN_DESCRIPTION_MAP[CHAIN_TOKEN_ADDRESS_TO_SYMBOL[option]]
                  const availableLiquidityUsd = vault.getAvailableLiquidityUsd(USE_CHAIN, option, isLong)

                  return $row(style({ placeContent: 'space-between', flex: 1 }))(
                    $tokenLabelFromSummary(tokenDesc),
                    $text(map(amountUsd => formatReadableUSD(amountUsd), availableLiquidityUsd))
                  )
                }, tradeParams.isLong),
                list: [
                  ARBITRUM_ADDRESS.NATIVE_TOKEN,
                  ARBITRUM_ADDRESS.LINK,
                  ARBITRUM_ADDRESS.UNI,
                  ARBITRUM_ADDRESS.WBTC,
                ],
              }
            })({
              select: changeIndexTokenTether()
            }),

            // $Popover({
            //   $$popContent: map(() => {
            //     return $column(layoutSheet.spacing)(

            //       $label(layoutSheet.spacingSmall, style({ alignItems: 'center', flexDirection: 'row', fontSize: '0.75em' }))(
            //         $Checkbox({
            //           value: map(x => !x, tradeParams.isIncrease)
            //         })({
            //           check: switchisIncreaseTether(map(x => !x))
            //         }),
            //         $row(layoutSheet.spacingTiny)(
            //           $icon({
            //             $content: $skull,
            //             width: '18px',
            //             fill: pallete.foreground,
            //             viewBox: '0 0 32 32'
            //           }),
            //           $text(style({ color: pallete.foreground }))('Degen Mode'),
            //           $infoTooltip('You are going to get liquidated stupid')
            //         ),
            //       ),
            //       $Select<TradeAddress>({
            //         value: tradeParams.indexToken,
            //         $container: $column(layoutSheet.spacing, style({ border: `1px solid ${pallete.horizon}`, borderWidth: '1px 1px 0', padding: '10px', position: 'relative', alignSelf: 'center' })),
            //         $$option: snapshot((isLong, option) => {
            //           const tokenDesc = option === AddressZero ? TOKEN_DESCRIPTION_MAP.ETH : TOKEN_DESCRIPTION_MAP[CHAIN_TOKEN_ADDRESS_TO_SYMBOL[option]]
            //           const availableLiquidityUsd = vault.getAvailableLiquidityUsd(USE_CHAIN, option, isLong)

            //           return $row(style({ placeContent: 'space-between' }))(
            //             style({
            //               borderBottom: `1px solid ${pallete.horizon}`,
            //               paddingBottom: '12px'
            //             })($tokenLabelFromSummary(tokenDesc)),
            //             $text(map(amountUsd => formatReadableUSD(amountUsd), availableLiquidityUsd))
            //           )
            //         }, tradeParams.isLong),
            //         list: [
            //           ARBITRUM_ADDRESS.NATIVE_TOKEN,
            //           ARBITRUM_ADDRESS.LINK,
            //           ARBITRUM_ADDRESS.UNI,
            //           ARBITRUM_ADDRESS.WBTC,
            //         ]
            //       })({
            //         select: changeIndexTokenTether()
            //       })
            //     )
            //   }, clickIndexGroup),
            // })(
            //   $row(clickIndexGroupTether(nodeEvent('click')), style({ cursor: 'pointer', position: 'relative', alignSelf: 'center', alignItems: 'center' }))(
            //     switchLatest(map(isLong => {
            //       return $icon({
            //         svgOps: style({ borderRadius: '50%', padding: '6px', zIndex: 1, marginRight: '-8px', backgroundColor: pallete.background, }),
            //         $content: isLong ? $bull : $bear,
            //         viewBox: '0 0 32 32',
            //         width: '36px',
            //       })
            //     }, tradeParams.isLong)),
            //     switchLatest(map(option => {
            //       const tokenDesc = TOKEN_DESCRIPTION_MAP[CHAIN_TOKEN_ADDRESS_TO_SYMBOL[option]]

            //       return $icon({ $content: $tokenIconMap[tokenDesc.symbol], svgOps: style({ zIndex: 0, }), width: '34px', viewBox: '0 0 32 32' })
            //     }, tradeParams.indexToken)),
            //     $icon({ $content: $caretDown, width: '14px', svgOps: style({ marginTop: '3px', marginLeft: '5px' }), viewBox: '0 0 32 32' }),
            //   )
            // )({}),
          ),

          $row(layoutSheet.spacing, style({ placeContent: 'space-between', padding: '0' }))(
            $hintInput(
              now(`Size`),
              'Amount amplified relative to collateral, higher Size to Collateral means higher risk of being liquidated',
              map(pos => formatReadableUSD(pos ? pos.size : 0n), state.vaultPosition),

              map((params) => {
                const posSize = params.vaultPosition?.size || 0n

                if (params.isIncrease) {
                  const posCollateral = params.vaultPosition?.collateral || 0n
                  const addCollateral = params.collateralDeltaUsd - params.fee
                  const collateral = addCollateral + posCollateral
                  const sizeDelta = collateral * params.leverage / BASIS_POINTS_DIVISOR

                  return formatReadableUSD(sizeDelta)
                }

                return formatReadableUSD(posSize - params.sizeDelta)
              }, tradeState)
            ),

            $node(style({ flex: 1 }))(),

            switchLatest(combineArray((isLong, network) => {

              if (network === null) {
                throw new Error('no network')
              }

              if (isLong) {
                return switchLatest(map(option => {
                  // const tokenDesc = option === AddressZero ? getTokenDescription(network as any, option) : TOKEN_DESCRIPTION_MAP[CHAIN_TOKEN_ADDRESS_TO_SYMBOL[option]]
                  const tokenDesc = TOKEN_DESCRIPTION_MAP[CHAIN_TOKEN_ADDRESS_TO_SYMBOL[option]]

                  return $row(layoutSheet.spacingTiny, style({ fontSize: '.75em', alignItems: 'center' }))(
                    $text(style({ color: pallete.foreground, marginRight: '3px' }))('Collateral In'),
                    $icon({ $content: $tokenIconMap[tokenDesc.symbol], width: '14px', viewBox: '0 0 32 32' }),
                    $text(tokenDesc.symbol)
                  )
                }, tradeParams.indexToken))
              }

              return $Dropdown<ARBITRUM_ADDRESS_STABLE | AVALANCHE_ADDRESS_STABLE>({
                $container: $row(style({ position: 'relative', alignSelf: 'center' })),
                $selection: $row(style({ alignItems: 'center', cursor: 'pointer' }))(
                  switchLatest(combineArray((collateralToken) => {
                    const defaultTokenDesc = TOKEN_DESCRIPTION_MAP[CHAIN_TOKEN_ADDRESS_TO_SYMBOL[collateralToken]]
                    const tokenDesc = isLong ? defaultTokenDesc : defaultTokenDesc.isStable ? defaultTokenDesc : TOKEN_DESCRIPTION_MAP.USDC

                    return $row(layoutSheet.spacingTiny, style({ fontSize: '.75em', alignItems: 'center' }))(
                      $text(style({ color: pallete.foreground, marginRight: '3px' }))('Collateral In'),
                      $icon({ $content: $tokenIconMap[tokenDesc.symbol], width: '14px', viewBox: '0 0 32 32' }),
                      $text(tokenDesc.symbol)
                    )
                  }, tradeParams.shortCollateralToken)),
                  $icon({ $content: $caretDown, width: '14px', viewBox: '0 0 32 32' })
                ),
                value: {
                  value: tradeParams.shortCollateralToken,
                  $container: $defaultSelectContainer(style({ minWidth: '300px', right: 0 })),
                  $$option: map(option => {
                    const tokenDesc = TOKEN_DESCRIPTION_MAP[CHAIN_TOKEN_ADDRESS_TO_SYMBOL[option]]

                    return $tokenLabelFromSummary(tokenDesc)
                  }),
                  list: [
                    ARBITRUM_ADDRESS.USDC,
                    ARBITRUM_ADDRESS.USDT,
                    ARBITRUM_ADDRESS.DAI,
                    ARBITRUM_ADDRESS.FRAX,
                  ],
                }
              })({
                select: changeCollateralTokenTether()
              })
            }, tradeParams.isLong, walletLink.network)),
          ),
        ),

        style({ margin: `0 -${BOX_SPACING}` })($Slider({
          value: map(lm => {
            if (lm === null) {
              return 0
            }

            return bnDiv(lm, MAX_LEVERAGE)
          }, mergeArray([
            initialLeverage,
            tradeParams.leverage
          ])),
          disabled: map(state => {

            if (state.vaultPosition === null) {
              return !state.isIncrease || state.collateralDelta === 0n
            }

            return false
          }, tradeState),
          color: map(isLong => isLong ? pallete.positive : pallete.negative, tradeParams.isLong),
          min: map(({ collateralDeltaUsd, pos, isIncrease }) => {
            if (!isIncrease) {
              return 0
            }

            const totalCollateral = (pos?.collateral || 0n) + collateralDeltaUsd
            const totalSize = pos?.size || 0n
            const leverage = div(totalSize, totalCollateral)

            const leverageBasis = bnDiv(leverage, MAX_LEVERAGE)

            return leverageBasis
          }, combineObject({ collateralDeltaUsd: state.collateralDeltaUsd, pos: state.vaultPosition, isIncrease: tradeParams.isIncrease })),
          max: map(({ collateralDeltaUsd, pos, isIncrease }) => {
            if (isIncrease) {
              return 1
            }

            const totalCollateral = (pos?.collateral || 0n) - collateralDeltaUsd
            const totalSize = (pos?.size || 0n)
            const multiplier = bnDiv(div(totalSize, totalCollateral), MAX_LEVERAGE)

            return multiplier
          }, combineObject({ collateralDeltaUsd: state.collateralDeltaUsd, pos: state.vaultPosition, isIncrease: tradeParams.isIncrease })),
          thumbText: map(n => formatLeverageNumber.format(n * MAX_LEVERAGE_NORMAL) + '\nx')
        })({
          change: slideLeverageTether(
            map(leverage => {
              const leverageRatio = BigInt(Math.floor(Math.abs(leverage) * Number(BASIS_POINTS_DIVISOR)))
              const leverageMultiplier = MAX_LEVERAGE * leverageRatio / BASIS_POINTS_DIVISOR

              return leverageMultiplier
            }),
            multicast
          )
        })),

        $row(layoutSheet.spacing, style({ placeContent: 'space-between', paddingBottom: '18px' }))(
          $column(
            $row(layoutSheet.spacingTiny, style({ fontSize: '0.75em' }))(
              $Tooltip({
                $anchor: $text(style({ color: pallete.foreground }))('Fees'),
                $content: switchLatest(map(params => {
                  const depositTokenNorm = params.inputToken === AddressZero ? CHAIN_NATIVE_TO_ADDRESS[USE_CHAIN] : params.inputToken


                  return $column(
                    depositTokenNorm !== params.indexToken ? $row(layoutSheet.spacingTiny)(
                      $text(style({ color: pallete.foreground }))('Swap'),
                      $text(formatReadableUSD(params.swapFee))
                    ) : empty(),
                    $row(layoutSheet.spacingTiny)(
                      $text(style({ color: pallete.foreground }))('Margin'),
                      $text(formatReadableUSD(params.marginFee))
                    )
                  )
                }, tradeState))
              })({}),
              $text(map(params => formatReadableUSD(params.fee), tradeState))
            ),
            $row(layoutSheet.spacingTiny, style({ fontSize: '0.75em' }))(
              $Tooltip({
                $anchor: $text(style({ color: pallete.foreground }))('Discount'),
                $content: switchLatest(map(params => {
                  const depositTokenNorm = params.inputToken === AddressZero ? CHAIN_NATIVE_TO_ADDRESS[USE_CHAIN] : params.inputToken

                  return $column(
                    $text(style({ color: pallete.foreground }))('BLUEBERRY Referral applied for 10% discount'),
                    // depositTokenNorm !== params.indexToken ? $row(layoutSheet.spacingTiny)(
                    //   $text(style({ color: pallete.foreground }))('Swap'),
                    //   $text(getRebateDiscountUsd(params.swapFee))
                    // ) : empty(),
                    // $row(layoutSheet.spacingTiny)(
                    //   $text(style({ color: pallete.foreground }))('Margin'),
                    //   $text(getRebateDiscountUsd(params.marginFee))
                    // )
                  )
                }, tradeState))
              })({}),
              $text(style({ color: pallete.positive }))(map(params => getRebateDiscountUsd(params.marginFee), tradeState))
            ),

            $TextField({
              label: 'Slippage %',
              value: tradeParams.slippage,
              inputOp: style({ width: '60px', fontWeight: 'normal' }),
              validation: map(n => {
                if (!Number(n)) {
                  return 'Invalid Basis point'
                }

                return null
              }),
            })({
              change: changeSlippageTether()
            })
          ),

          $IntermediateConnectButton({
            walletStore: walletStore,
            $connectLabel: $text('Connect To Trade'),
            $container: $column(
              layoutSheet.spacingBig,
              style({ zIndex: 10 }),
              styleBehavior(map(xcsChange => xcsChange && xcsChange.time ? { opacity: .3 } : { opacity: 1 }, pnlCrossHairTimeChange))
            ),
            $display: map(() => {

              return $row(layoutSheet.spacingSmall, style({ alignItems: 'center' }))(
                $ButtonSecondary({
                  buttonOp: style({ padding: '8px', placeSelf: 'center' }),
                  disabled: map(params => {
                    if (params.sizeDelta > 0n || params.collateralDelta > 0n) {
                      return false
                    }

                    return true
                  }, tradeState),
                  $content: $text('Reset')
                })({
                  click: clickResetTether()
                }),
                $ButtonPrimary({
                  disabled: map(params => {
                    if (params.leverage > MAX_LEVERAGE || params.leverage < MIN_LEVERAGE) {
                      return true
                    }

                    if (params.isIncrease && (params.collateralDeltaUsd > 0n || params.sizeDelta > 0n) && params.collateralDelta <= params.walletBalance) {
                      return false
                    }

                    if (params.vaultPosition && !params.isIncrease && (params.sizeDelta > 0n || params.collateralDeltaUsd > 0n)
                      && (params.liquidationPrice === null || (params.isLong
                        ? params.liquidationPrice! <= params.indexTokenPrice
                        : params.liquidationPrice! >= params.indexTokenPrice))) {
                      return false
                    }

                    return true
                  }, tradeState),
                  $content: $text(map(params => {
                    const outputToken = getTokenDescription(USE_CHAIN, params.indexToken)

                    let modLabel: string

                    if (params.vaultPosition) {
                      if (params.isIncrease) {
                        modLabel = 'Increase'
                      } else {
                        modLabel = params.sizeDelta === params.vaultPosition.size || params.collateralDeltaUsd === params.vaultPosition.collateral ? 'Close' : 'Reduce'
                      }
                    } else {
                      modLabel = 'Open'
                    }

                    return `${modLabel} ${params.isLong ? 'Long' : 'Short'} ${outputToken.symbol}`
                  }, tradeState)),
                })({
                  click: requestTradeTether(snapshot((state) => {
                    return state
                  }, tradeState))
                }),

                switchLatest(map(error => {
                  if (error === null) {
                    return empty()
                  }

                  return $Tooltip({
                    $content: $text(style({ fontSize: '.75em', }))(error),
                    $container: $column(style({ marginLeft: '-25px', zIndex: 5, backgroundColor: '#000', borderRadius: '50%', })),
                    $anchor: $icon({
                      $content: $alertIcon, viewBox: '0 0 24 24', width: '28px',
                      svgOps: style({ fill: pallete.negative, padding: '3px', filter: 'drop-shadow(black 0px 0px 10px) drop-shadow(black 0px 0px 10px) drop-shadow(black 0px 0px 1px)' })
                    })
                  })({})
                }, skipRepeats(validationError)))
              )
            }),
            ensureNetwork: true,
            walletLink: walletLink
          })({ walletChange: walletChangeTether() })
        ),

        switchLatest(map(trade => {
          if (trade === null) {
            return empty()
          }

          const hoverChartPnl = multicast(switchLatest(map((chartCxChange) => {
            if (chartCxChange) {
              return now(chartCxChange)
            }

            if (isTradeSettled(trade)) {
              return now(formatFixed(trade.realisedPnl - trade.fee, 30))
            }

            return map(price => {
              const delta = getPnL(trade.isLong, trade.averagePrice, price, trade.size)
              const val = formatFixed(delta + trade.realisedPnl - trade.fee, 30)

              return val
            }, state.indexTokenPrice)

          }, pnlCrossHairTime)))



          return $column(style({ position: 'relative', margin: `0 -${BOX_SPACING}`, zIndex: 0, backgroundColor: pallete.background, borderRadius: '20px', overflow: 'hidden' }))(
            style({
              pointerEvents: 'none',
              textAlign: 'center',
              marginBottom: '-30px',
              fontSize: '1.75em', alignItems: 'baseline', paddingTop: '15px', paddingBottom: '15px', background: 'radial-gradient(rgba(0, 0, 0, 0.37) 9%, transparent 63%)',
              lineHeight: 1,
              fontWeight: "bold",
              zIndex: 10,
              position: 'relative'
            })(
              $NumberTicker({
                value$: map(Math.round, motion({ ...MOTION_NO_WOBBLE, precision: 15, stiffness: 210 }, 0, hoverChartPnl)),
                incrementColor: pallete.positive,
                decrementColor: pallete.negative
              })
            ),
            $TradePnlHistory({
              trade, latestPrice: state.indexTokenPrice, chain
            })({
              crosshairMove: crosshairMoveTether(),
              // hoveredPriceTick: hoveredPriceTickTether()
            })
          )


        }, tradeParams.trade))
      )
    ),

    {
      switchIsLong,
      changeInputToken,
      changeIndexToken,
      leverage: mergeArray([
        snapshot((params, size) => {
          const posCollateral = params.vaultPosition?.collateral || 0n
          const posSize = params.vaultPosition?.size || 0n
          const totalSize = posSize + size

          if (params.isIncrease) {
            const totalCollateral = posCollateral + params.collateralDeltaUsd
            return div(totalSize, totalCollateral)
          }

          if (!params.vaultPosition) {
            return 0n
          }

          const levMultipler = div(posSize - size, posCollateral - params.collateralDeltaUsd)
          return levMultipler
        }, tradeState, sizeChangeEffect),
        initialLeverage,

        slideLeverage
      ]),
      switchIsIncrease,
      changeCollateralToken,
      changeCollateralDelta: mergeArray([
        slideCollateral,
        inputCollateral,
        clickResetVal,
      ]),
      changeSize: mergeArray([
        clickResetVal,
        inputSizeDelta,
        changeSizeByRatio,
      ]),
      changeCollateralRatio: mergeArray([
        slideCollateralRatio,
        snapshot(params => {
          if (params.isIncrease) {
            const newLocal = div(params.collateralDelta, params.walletBalance)
            return newLocal
          }

          return params.vaultPosition ? div(params.collateralDelta, params.vaultPosition.collateral) : 0n
        }, tradeState, mergeArray([constant(0n, clickReset), inputCollateral])),

        constant(0n, switchIsIncrease)
        // }, tradeState, combineObject({ switchIsIncrease, inputCollateral }))
      ]),
      walletChange,
      changeSlippage,

      requestTrade,

      // state
      // changeCollateralUsd,

      // fee, swapFee, marginFee,
      // averagePrice, liquidationPrice,
      // walletBalance, inputTokenDescription, collateralTokenDescription,
      // indexTokenDescription, indexTokenCumulativeFundingRate,


      // // none trade related


      // requestTrade,

      // state
    }
  ]
})


const formatLeverageNumber = new Intl.NumberFormat("en-US", {
  // style: "currency",
  // currency: "USD",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
})



const $field = $element('input')(attr({ placeholder: '0.0', type: 'number' }), style({ width: '100%', fontFamily: '-apple-system,BlinkMacSystemFont,Trebuchet MS,Roboto,Ubuntu,sans-serif', minWidth: '0', transition: 'background 500ms ease-in', flex: 1, fontSize: '1.55em', background: 'transparent', border: 'none', height: '35px', outline: 'none', color: pallete.message }))

const $hintInput = (label: Stream<string>, tooltip: string | Stream<string>, val: Stream<string>, change: Stream<string>) => $row(layoutSheet.spacingTiny, style({ fontSize: '0.75em' }))(
  $text(style({}))(val),
  $text(style({ color: pallete.foreground }))('→'),
  $text(style({}))(change),
  $text(style({ color: pallete.foreground }))(label),
  $infoTooltip(tooltip)
)


function getRebateDiscountUsd(amountUsd: bigint) {
  return formatReadableUSD(amountUsd * 1500n / BASIS_POINTS_DIVISOR)
}
