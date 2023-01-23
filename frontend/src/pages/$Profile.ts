import { Behavior, combineArray, O } from "@aelea/core"
import { $Node, $text, component, style } from "@aelea/dom"
import { Route } from "@aelea/router"
import { $column, $row, layoutSheet } from "@aelea/ui-components"
import { blueberrySubgraph, saleDescriptionList } from "@gambitdao/gbc-middleware"
import { awaitPromises, combine, empty, map, mergeArray, now, switchLatest } from "@most/core"
import { $infoTooltipLabel, $IntermediatePromise, $openPositionPnlBreakdown, $PnlValue, $riskLiquidator, $sizeDisplay, $TradePnl } from "@gambitdao/ui-components"
import { $discoverIdentityDisplay } from "../components/$AccountProfile"
import { $berryTileId, $CardTable } from "../components/$common"
import {
  getSafeMappedValue, IRequestAccountTradeListApi,
  IRequestPageApi, IStake, ITradeOpen, ITradeSettled, readableDate, timeSince, TRADE_CONTRACT_MAPPING, unixTimestampNow
} from "@gambitdao/gmx-middleware"
import { Stream } from "@most/types"
import { connectGmxEarn } from "../logic/contract"
import { $labItem } from "../logic/common"
import { pallete } from "@aelea/ui-components-theme"
import { connectLab } from "../logic/contract/gbc"
import { CHAIN, IWalletLink, IWalletName } from "@gambitdao/wallet-link"
import { $Index } from "./$Leaderboard"
import { connectTradeReader } from "../logic/contract/trade"
import * as $ButtonToggle from "@gambitdao/ui-components/src/$ButtonToggle"
import * as router from '@aelea/router'
import { fadeIn } from "../transitions/enter"




export enum IProfileActiveTab {
  TRADING = 'Trading',
  BERRIES = 'Berries',
  WARDROBE = "Wardrobe"
}

export interface IProfile {
  account: string
  parentUrl: string
  parentRoute: Route
  stake: Stream<IStake[]>
  walletLink: IWalletLink
  accountTradeList: Stream<Promise<IRequestPageApi<ITradeSettled>>>
  accountOpenTradeList: Stream<Promise<ITradeOpen[]>>

  $actions?: $Node
}
const $title = $text(style({ fontWeight: 'bold', fontSize: '1.55em' }))

export const $Profile = (config: IProfile) => component((
  [changeRoute, changeRouteTether]: Behavior<string, string>,
  [selectProfileMode, selectProfileModeTether]: Behavior<IProfileActiveTab, IProfileActiveTab>,
  [requestAccountTradeList, requestAccountTradeListTether]: Behavior<number, IRequestAccountTradeListApi>,
  [walletChange, walletChangeTether]: Behavior<IWalletName, IWalletName>,
  [changeNetwork, changeNetworkTether]: Behavior<CHAIN, CHAIN>,
) => {

  // activeTab: Stream<IProfileActiveTab>

  const requestAccountOpenTradeList: Stream<IRequestAccountTradeListApi> = map(chain => {
    return {
      account: config.account,
      chain: chain,
    }
  }, config.walletLink.network)

  const tradeReader = connectTradeReader(config.walletLink.provider)

  const arbitrumContract = switchLatest(combineArray((provider, chain) => {

    const contractMapping = getSafeMappedValue(TRADE_CONTRACT_MAPPING, chain, CHAIN.ARBITRUM)

    if (contractMapping === null) {
      return now(null)
    }

    return connectGmxEarn(now(provider), config.account, contractMapping).stakingRewards
  }, config.walletLink.provider, config.walletLink.network))

  const lab = connectLab(config.walletLink.provider)
  const ownedItems = lab.accountListBalance(saleDescriptionList.map(x => x.id))


  return [

    $column(layoutSheet.spacingBig, style({ width: '100%', maxWidth: '550px', margin: '0 auto', alignItems: 'center' }))(
      $row(style({ flex: 1, alignItems: 'center', placeContent: 'center', zIndex: 1 }))(
        $discoverIdentityDisplay({
          address: config.account,
          avatarSize: 100,
          labelSize: '1.5em'
        }),

        config.$actions || empty(),
      ),

      $ButtonToggle.default({
        $container: $ButtonToggle.$defaulContainer(style({ alignSelf: 'center', })),
        selected: mergeArray([selectProfileMode, now(location.pathname.split('/').slice(-1)[0] === IProfileActiveTab.BERRIES.toLowerCase() ? IProfileActiveTab.BERRIES : IProfileActiveTab.TRADING)]),
        options: [
          IProfileActiveTab.BERRIES,
          IProfileActiveTab.TRADING,
          // IProfileActiveTab.WARDROBE,
        ],
        $$option: map(option => {
          return $text(option)
        })
      })({ select: selectProfileModeTether() }),


      $column(layoutSheet.spacingBig, style({ width: '100%' }))(
        router.match(config.parentRoute.create({ fragment: IProfileActiveTab.BERRIES.toLowerCase() }))(
          fadeIn(
            $IntermediatePromise({
              query: blueberrySubgraph.owner(now({ id: config.account })),
              $$done: map(owner => {
                if (owner === null) {
                  return null
                }

                return $column(layoutSheet.spacingBig)(

                  $title(`GBC's`),
                  $row(layoutSheet.spacingSmall, style({ flexWrap: 'wrap' }))(...owner.ownedTokens.map(token => {
                    return $berryTileId(token, 65)
                  })),



                  $row(
                    $title('Lab Items'),

                    // switchLatest(map(items => {
                    //   return $Popover({
                    //     $$popContent: map(_ => $TransferItems(items.filter(x => x.amount > 0))({}), clickTransferItems),

                    //   })(
                    //     $ButtonSecondary({ $content: $text('Transfer') })({
                    //       click: clickTransferItemsTether()
                    //     })
                    //   )({})
                    // }, ownedItems))

                  ),


                  switchLatest(map(items => {
                    return $row(layoutSheet.spacing, style({ flexWrap: 'wrap' }))(
                      ...items.filter(item => item.amount > 0).map(item => {
                        return $row(style({ position: 'relative' }))(
                          $text(style({ position: 'absolute', top: '1px', right: '4px', fontSize: '.75em', fontWeight: 'bold', color: pallete.background }))(
                            item.amount + 'x'
                          ),
                          $labItem(item.id, 65)
                        )
                      })
                    )
                  }, ownedItems))

                )
              })
            })({})
          )
        ),
        router.match(config.parentRoute.create({ fragment: IProfileActiveTab.TRADING.toLowerCase() }))(
          fadeIn(
            $column(layoutSheet.spacingBig, style({ flex: 1 }))(
              $title('Open Positions'),
              $CardTable({
                dataSource: awaitPromises(config.accountOpenTradeList),
                columns: [
                  {
                    $head: $text('Entry'),
                    columnOp: O(style({ maxWidth: '50px' }), layoutSheet.spacingTiny),
                    $$body: map((pos) => {
                      return $Index(pos)
                    })
                  },
                  {
                    $head: $column(style({ textAlign: 'center' }))(
                      $text('Size'),
                      $text(style({ fontSize: '.75em' }))('Collateral'),
                    ),
                    columnOp: O(layoutSheet.spacingTiny, style({ flex: 1.2, placeContent: 'flex-end' })),
                    $$body: map(pos => {
                      const positionMarkPrice = tradeReader.getLatestPrice(now(pos.indexToken))

                      return $row(
                        $riskLiquidator(pos, positionMarkPrice)
                      )
                    })
                  },
                  {
                    $head: $text('PnL'),
                    columnOp: O(layoutSheet.spacingTiny, style({ flex: 1, placeContent: 'flex-end' })),
                    $$body: map((pos) => {
                      const positionMarkPrice = tradeReader.getLatestPrice(now(pos.indexToken))
                      const cumulativeFee = tradeReader.getTokenCumulativeFunding(now(pos.collateralToken))

                      return $infoTooltipLabel(
                        $openPositionPnlBreakdown(pos, cumulativeFee, positionMarkPrice),
                        $TradePnl(pos, cumulativeFee, positionMarkPrice)
                      )
                    })
                  },
                ],
              })({}),

              $title('Settled Positions'),
              $CardTable({
                dataSource: awaitPromises(config.accountTradeList),
                columns: [
                  {
                    $head: $text('Time'),
                    columnOp: O(style({ maxWidth: '100px' })),

                    $$body: map((req) => {
                      const isKeeperReq = 'ctx' in req

                      const timestamp = isKeeperReq ? unixTimestampNow() : req.settledTimestamp

                      return $column(layoutSheet.spacingTiny, style({ fontSize: '.65em' }))(
                        $text(timeSince(timestamp) + ' ago'),
                        $text(readableDate(timestamp)),
                      )
                    })
                  },
                  {
                    $head: $text('Entry'),
                    columnOp: O(style({ maxWidth: '50px' }), layoutSheet.spacingTiny),
                    $$body: map((pos) => {
                      return $Index(pos)
                    })
                  },
                  {
                    $head: $column(style({ textAlign: 'center' }))(
                      $text('Size'),
                      $text(style({ fontSize: '.75em' }))('Collateral'),
                    ),
                    columnOp: O(layoutSheet.spacingTiny, style({ flex: 1.2, placeContent: 'flex-end' })),
                    $$body: map(pos => {
                      return $sizeDisplay(pos)
                    })
                  },
                  {
                    $head: $text('PnL'),
                    columnOp: O(layoutSheet.spacingTiny, style({ flex: 1, placeContent: 'flex-end' })),
                    $$body: map((pos) => {
                      return $PnlValue(pos.realisedPnl - pos.fee)
                    })
                  },
                ],
              })({
                scrollIndex: requestAccountTradeListTether(
                  combine((chain, pageIndex) => {
                    return {
                      account: config.account,
                      chain: chain,
                      offset: pageIndex * 20,
                      pageSize: 20,
                    }
                  }, config.walletLink.network)
                )
              }),
            ),
          )
        ),

        // router.match(config.parentRoute.create({ fragment: IProfileActiveTab.WARDROBE.toLowerCase() }))(
        //   fadeIn(
        //     $Wardrobe({ chainList: [CHAIN.ARBITRUM], walletLink: config.walletLink, parentRoute: config.parentRoute })({
        //       changeRoute: changeRouteTether(),
        //       changeNetwork: changeNetworkTether(),
        //       walletChange: walletChangeTether(),
        //     })
        //   )
        // ),








        // $responsiveFlex(
        //   $row(style({ flex: 1 }))(
        //     $StakingGraph({
        //       sourceList: config.stake,
        //       stakingInfo: multicast(arbitrumContract),
        //       walletLink: config.walletLink,
        //       // priceFeedHistoryMap: pricefeedQuery,
        //       // graphInterval: intervalTimeMap.HR4,
        //     })({}),
        //   ),
        // ),

        // $IntermediatePromise({
        //   query: blueberrySubgraph.owner(now({ id: config.account })),
        //   $$done: map(owner => {
        //     if (owner == null) {
        //       return $alert($text(style({ alignSelf: 'center' }))(`Connected account does not own any GBC's`))
        //     }

        //     return $row(layoutSheet.spacingSmall, style({ flexWrap: 'wrap' }))(...owner.ownedTokens.map(token => {
        //       return $berryTileId(token, 85)
        //     }))
        //   }),
        // })({}),

      ),

    ),

    {
      selectProfileMode,
      walletChange,
      changeNetwork,
      stake: map(chain => ({ chain, account: config.account }), config.walletLink.network),
      changeRoute: mergeArray([
        changeRoute,
        map(mode => {
          const pathName = config.parentUrl + mode.toLowerCase()
          if (location.pathname !== pathName) {
            history.pushState(null, '', pathName)
          }

          return pathName
        }, selectProfileMode)
      ]),
      requestAccountTradeList,
      requestAccountOpenTradeList,
    }
  ]
})


