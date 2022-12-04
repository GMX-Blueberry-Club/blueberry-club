import { Behavior } from "@aelea/core"
import { $text, component, style } from "@aelea/dom"
import { Route } from "@aelea/router"
import { $column, $icon, $row, layoutSheet, state } from "@aelea/ui-components"
import { IToken } from "@gambitdao/gbc-middleware"
import { CHAIN, CHAIN_TOKEN_ADDRESS_TO_SYMBOL, formatReadableUSD, getPnL, IAccountSummary, IChainParamApi, ILeaderboardRequest, intervalTimeMap, IPageParapApi, ITrade, ITradeOpen, TOKEN_SYMBOL } from "@gambitdao/gmx-middleware"

import { IWalletLink } from "@gambitdao/wallet-link"
import { fromPromise, map, startWith } from "@most/core"
import { $responsiveFlex } from "../elements/$common"
import { queryLatestPrices, queryOwnerV2 } from "../logic/query"
import { IAccountStakingStore } from "@gambitdao/gbc-middleware"
import { ContractTransaction } from "@ethersproject/contracts"
import { Stream } from "@most/types"
import { $bear, $bull, $ProfitLossText, $tokenIconMap, TablePageResponse } from "@gambitdao/ui-components"
import { pallete } from "@aelea/ui-components-theme"
import { resolveAddress } from "../logic/utils"


export interface IAccount {
  walletLink: IWalletLink
  parentRoute: Route
  accountStakingStore: state.BrowserStore<IAccountStakingStore, "accountStakingStore">
  leaderboardTopList: Stream<IPageParapApi<IAccountSummary>>
  openTrades: Stream<IPageParapApi<ITradeOpen>>
}

export const $Leaderboard = ({ walletLink, openTrades, leaderboardTopList, parentRoute, accountStakingStore }: IAccount) => component((
  [selectTokensForWhitelist, selectTokensForWhitelistTether]: Behavior<IToken[], IToken[]>,
  [selectTokensToWithdraw, selectTokensToWithdrawTether]: Behavior<IToken[], IToken[]>,
  [clickWithdraw, clickWithdrawTether]: Behavior<PointerEvent, PointerEvent>,
  [openPositionsRequest, openPositionsRequestTether]: Behavior<number, number>,
  [changeRoute, changeRouteTether]: Behavior<string, string>,

  [stakeTxn, stakeTxnTether]: Behavior<any, Promise<ContractTransaction>>,
  [setApprovalForAll, setApprovalForAllTether]: Behavior<any, Promise<ContractTransaction>>,
  [tableTopPnlRequest, tableTopPnlRequestTether]: Behavior<number, number>,

) => {

  const tableRequestState = map((page): IChainParamApi & ILeaderboardRequest => {
    return {
      timeInterval: intervalTimeMap.DAY7,
      offset: page * 20,
      pageSize: 20,
      sortBy: 'realisedPnl',
      chain: CHAIN.ARBITRUM,
      sortDirection: 'asc'
    }
  }, tableTopPnlRequest)


  const urlFragments = document.location.pathname.split('/')
  const accountAddress = urlFragments[urlFragments.length - 1].toLowerCase()

  const queryOwner = fromPromise(accountAddress ? queryOwnerV2(accountAddress) : Promise.reject())

  const ownedTokens = map(owner => {
    if (owner === null) {
      return null
    }

    return owner.ownedTokens
  }, queryOwner)

  // const stakedList = map(owner => owner.stakedTokenList, queryOwner)


  // const gbcWallet = connectGbc(walletLink)
  // const rewardDistributor = connectRewardDistributor(walletLink)

  const priceMap = fromPromise(queryLatestPrices())


  // const isApprovedForAll = replayLatest(multicast(rewardDistributor.isApprovedForAll))

  // Promise<ContractReceipt>

  const chosenTokens = startWith([], selectTokensForWhitelist)

  const openPositions: Stream<TablePageResponse<ITradeOpen>> = map((res) => {
    return {
      data: res.page,
      pageSize: res.pageSize,
      offset: res.offset,
    }
  }, openTrades)

  return [
    $responsiveFlex(layoutSheet.spacingBig)(


      // $column(layoutSheet.spacingBig, style({ width: '500px' }))(

      //   $alert($text('Trading Leaderboard. Work in Progress (;')),


      //   $accountPreview({
      //     address: accountAddress,
      //     avatarSize: 150,
      //     labelSize: '2em'
      //   }),
      // ),

      $column(style({ gap: '50px', flex: 1 }))(

        // $Table2<ITradeOpen>({
        //   bodyContainerOp: layoutSheet.spacing,
        //   scrollConfig: {
        //     containerOps: O(layoutSheet.spacingBig)
        //   },
        //   // filterChange: tableTopOpenSortBy,
        //   sortChange: now('realisedPnlPercentage'),
        //   dataSource: openPositions,
        //   columns: [
        //     {
        //       $head: $text('Account'),
        //       columnOp: style({ minWidth: '125px' }),
        //       $body: map(({ account }: { account: string }) => {
        //         return $accountPreview({  address: account })
        //       })
        //     },
        //     {
        //       $head: $text('Entry'),
        //       columnOp: O(style({ maxWidth: '58px', flexDirection: 'column' }), layoutSheet.spacingTiny),
        //       $body: map(pos => {
        //         return $Link({
        //           anchorOp: style({ position: 'relative' }),
        //           $content: style({ pointerEvents: 'none' }, $Entry(pos)),
        //           url: `/${getChainName(CHAIN.ARBITRUM).toLowerCase()}/${CHAIN_TOKEN_ADDRESS_TO_SYMBOL[pos.indexToken]}/${pos.id}/${pos.timestamp}`,
        //           route: parentRoute.create({ fragment: '2121212' })
        //         })({ click: changeRouteTether() })
        //       })
        //     },
        //     {
        //       $head: $text('Risk-$'),
        //       sortBy: 'size',
        //       columnOp: style({ flex: 1.3, alignItems: 'center', placeContent: 'center', minWidth: '80px' }),
        //       $body: map(trade => {
        //         const positionMarkPrice = map(priceMap => priceMap[trade.indexToken].value, config.latestPriceMap)
        //         return $RiskLiquidator(trade, positionMarkPrice)({})
        //       })
        //     },
        //     {
        //       $head: $text('PnL-$'),
        //       sortBy: 'realisedPnl',
        //       columnOp: style({ flex: 2, placeContent: 'flex-end', maxWidth: '110px' }),
        //       $body: map(trade => {
        //         const positionMarkPrice = map(priceMap => {
        //           return priceMap[trade.indexToken].value
        //         }, config.latestPriceMap)
        //         return $livePnl(trade, positionMarkPrice)
        //       })
        //     },
        //   ],
        // })({ scrollIndex: openPositionsRequestTether() }),

        // $Table2<IAccountSummary>({
        //   bodyContainerOp: layoutSheet.spacing,
        //   rowOp: layoutSheet.spacingTiny,
        //   scrollConfig: {
        //     containerOps: O(layoutSheet.spacingBig)
        //   },
        //   // sortChange: now(tableTopSettledSortByStore.state),
        //   // filterChange: merge(topPnlTimeframeChange, tableTopSettledSortByChange),
        //   dataSource: map((res) => {
        //     return {
        //       data: res.page,
        //       pageSize: res.pageSize,
        //       offset: res.offset,
        //     }
        //   }, leaderboardTopList),
        //   columns: [
        //     {
        //       $head: $text('Account'),
        //       columnOp: style({ minWidth: '125px' }),
        //       $body: map(({ account }) => {
        //         return $accountPreview({ address: account })
        //       })
        //     },
        //     {
        //       $head: $text('Win/Loss'),
        //       columnOp: style({ maxWidth: '65px', placeContent: 'center' }),
        //       $body: map(pos => {
        //         return $row(
        //           $text(`${pos.winTradeCount}/${pos.settledTradeCount - pos.winTradeCount}`)
        //         )
        //       })
        //     },
        //     {
        //       $head: $text('Risk-$'),
        //       sortBy: 'size',
        //       columnOp: style({ placeContent: 'center', minWidth: '125px' }),
        //       $body: map(pos => {
        //         return $risk(pos)
        //       })
        //     },
        //     {
        //       $head: $text('PnL-$'),
        //       sortBy: 'realisedPnl',
        //       columnOp: style({ flex: 1.2, placeContent: 'flex-end', maxWidth: '110px' }),
        //       $body: map(pos => $ProfitLossText(pos.realisedPnl))
        //     },
        //   ],
        // })({
        //   scrollIndex: tableTopPnlRequestTether(),
        //   // sortBy: tableTopSettledsortByChangeTether()
        // }),





      ),
    ),

    {
      requestLeaderboardTopList: tableRequestState,
    }
  ]
})


export const $livePnl = (trade: ITrade, pos: Stream<bigint>) => $row(
  $ProfitLossText(
    map(price => {
      const delta = getPnL(trade.isLong, trade.averagePrice, price, trade.size)

      return trade.realisedPnl + delta - trade.fee
    }, pos)
  )
)

export const $Entry = (chain: CHAIN, pos: ITrade) =>
  $row(
    $column(layoutSheet.spacingTiny, style({ alignSelf: 'flex-start' }))(
      $entryDisplay(chain, pos),
      $text(style({ fontSize: '.65em', textAlign: 'center', color: pallete.primary }))(formatReadableUSD(pos.averagePrice))
    )
  )


export function $entryDisplay(chain: CHAIN, pos: ITrade) {
  const newLocal = resolveAddress(chain, pos.indexToken)
  return $row(style({ position: 'relative', flexDirection: 'row', alignSelf: 'center' }))(
    style({ marginRight: '-5px' })(
      // @ts-ignore
      $TokenIcon(CHAIN_TOKEN_ADDRESS_TO_SYMBOL[newLocal])
    ),
    style({ borderRadius: '50%', padding: '3px', backgroundColor: pallete.background, })(
      $icon({
        $content: pos.isLong ? $bull : $bear,
        viewBox: '0 0 32 32',
      })
    )
  )
}


export const $TokenIcon = (indexToken: TOKEN_SYMBOL, IIcon?: { width?: string }) => {
  const $token = $tokenIconMap[indexToken]

  if (!$token) {
    throw new Error('Unable to find matched token')
  }

  return $icon({
    $content: $token,
    viewBox: '0 0 32 32',
    width: '24px',
    ...IIcon
  })
}


