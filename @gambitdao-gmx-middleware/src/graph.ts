import { O } from "@aelea/core"
import { awaitPromises, map } from "@most/core"
import { intervalTimeMap } from "./constant"
import { tradeJson } from "./fromJson"
import { toAccountCompetitionSummary, toAccountSummary } from "./gmxUtils"
import { IRequestAccountApi, IChainParamApi, IRequestCompetitionLadderApi, IRequestLeaderboardApi, IRequestPagePositionApi, IPricefeed, IRequestPricefeedApi, IPriceLatest, IRequestGraphEntityApi, IStake, IRequestTimerangeApi, ITrade, TradeStatus } from "./types"
import { cacheMap, createSubgraphClient, groupByMap, pagingQuery, unixTimestampNow } from "./utils"
import { gql } from "@urql/core"
import * as fromJson from "./fromJson"
import * as fetch from "isomorphic-fetch"
import { CHAIN } from "@gambitdao/wallet-link"

export type IAccountTradeListParamApi = IChainParamApi & IRequestAccountApi & { status: TradeStatus };


const createCache = cacheMap({})

const cacheLifeMap = {
  [intervalTimeMap.HR24]: intervalTimeMap.MIN5,
  [intervalTimeMap.DAY7]: intervalTimeMap.MIN30,
  [intervalTimeMap.MONTH]: intervalTimeMap.MIN60,
}

export const arbitrumGraph = createSubgraphClient({
  fetch: fetch as any,
  url: 'https://api.thegraph.com/subgraphs/name/nissoh/gmx-arbitrum'
})

export const arbitrumGraphDev = createSubgraphClient({
  fetch: fetch as any,
  url: 'https://api.thegraph.com/subgraphs/name/nissoh/gmx-arbitrum-dev'
})

export const avalancheGraph = createSubgraphClient({
  fetch: fetch as any,
  url: 'https://api.thegraph.com/subgraphs/name/nissoh/gmx-avalanche'
})


export const subgraphChainMap: { [p in CHAIN]: typeof arbitrumGraph } = {
  [CHAIN.ARBITRUM]: arbitrumGraph,
  [CHAIN.AVALANCHE]: avalancheGraph,
} as any


export const globalCache = cacheMap({})


export const pricefeed = O(
  map(async (queryParams: IRequestPricefeedApi) => {
    const newLocal = `
      {
        pricefeeds(first: 1000, orderBy: timestamp, orderDirection: asc, where: {tokenAddress: _${queryParams.tokenAddress}, interval: _${queryParams.interval}, timestamp_gte: ${queryParams.from}, timestamp_lte: ${queryParams.to || unixTimestampNow()} }) {
          ${pricefeedFields}
        }
      }
`

    const priceFeedQuery = await querySubgraph(queryParams, newLocal)
    return priceFeedQuery.pricefeeds.map(fromJson.pricefeedJson) as IPricefeed[]
  })
)


export const stake = O(
  map(async (queryParams: IChainParamApi & IRequestAccountApi) => {

    const priceFeedQuery = await querySubgraph(queryParams, `
{
  stakes(first: 1000, orderBy: timestamp, orderDirection: desc, where:{ account: "${queryParams.account.toLowerCase()}" }) {
    id
    account
    contract
    token
    amount
    amountUsd
    timestamp
  }
}`)
    return priceFeedQuery.stakes.map(fromJson.stakeJson) as IStake[]
  }),
  awaitPromises
)

export const trade = O(
  map(async (queryParams: IRequestGraphEntityApi) => {

    if (!queryParams?.id) {
      return null
    }

    const priceFeedQuery = await querySubgraph(queryParams, `
{
  trade(id: ${queryParams.id.toLowerCase()} ) {
      ${tradeFields}
  }
}
`)


    if (priceFeedQuery === null) {
      throw new Error('Trade not found')
    }

    return fromJson.tradeJson(priceFeedQuery.trade)
  }),
  awaitPromises
)

export const latestPriceMap = O(
  map(async (queryParams: IChainParamApi): Promise<IPriceLatest[]> => {

    const res = await await querySubgraph(queryParams, `
{
  priceLatests {
    id
    value
    timestamp
  }
}
`)

    return res.priceLatests.map(fromJson.priceLatestJson) as IPriceLatest[]
  }),
  awaitPromises
)

export const accountTradeList = O(
  map(async (queryParams: IAccountTradeListParamApi) => {

    if (queryParams === null) {
      return []
    }

    const res = await await querySubgraph(queryParams, `
{
  trades(first: 1000, skip: 0, where: { account: "${queryParams.account.toLowerCase()}" }) {
    ${tradeFields}
  }
}
`)

    return res.trades.map(fromJson.tradeJson) as ITrade[]
  })
)

export const leaderboardTopList = O(
  map(async (queryParams: IRequestLeaderboardApi) => {
    const cacheLife = cacheLifeMap[queryParams.timeInterval]
    const cacheKey = 'requestLeaderboardTopList' + queryParams.timeInterval + queryParams.chain

    const to = await createCache(cacheKey, cacheLife, async () => unixTimestampNow())
    const from = to - queryParams.timeInterval

    const cacheQuery = fetchTrades({ from, to, ...queryParams }, async (params) => {
      const res = await querySubgraph(params, `
{
  trades(first: 1000, skip: ${params.offset}, where: {timestamp_gte: ${from}, timestamp_lte: ${to}}) {
    ${tradeFields}
  }
}
`)
      return res.trades as ITrade[]
    }).then(list => {
      const formattedList = list.map(tradeJson)

      const summary = toAccountSummary(formattedList)

      return summary
    })

    return pagingQuery(queryParams, await cacheQuery)
  }),
  awaitPromises
)


export const competitionCumulativeRoi = O(
  map(async (queryParams: IRequestCompetitionLadderApi) => {
    const dateNow = unixTimestampNow()
    const to = Math.min(dateNow, queryParams.to)
    const timeSlot = Math.floor(to / intervalTimeMap.MIN5)
    const timestamp = timeSlot * intervalTimeMap.MIN5 - intervalTimeMap.MIN5

    const from = queryParams.from

    const competitionAccountListQuery = fetchTrades({ ...queryParams, from, to, offset: 0, pageSize: 1000 }, async (params) => {
      const res = await arbitrumGraphDev(gql(`

query {
  trades(first: 1000, skip: ${params.offset}, where: { entryReferralCode: "${queryParams.referralCode}", timestamp_gte: ${params.from}, timestamp_lte: ${params.to}}) {
      ${tradeFields}
      entryReferralCode
      entryReferrer
  }
}
`), {})

      return res.trades as ITrade[]
    })


    const priceMapQuery = querySubgraph(queryParams, `
      {
        pricefeeds(where: { timestamp: ${timestamp.toString()} }) {
          id
          timestamp
          tokenAddress
          c
          interval
        }
      }
    `).then(res => {
      const list = groupByMap(res.pricefeeds, (item: IPricefeed) => item.tokenAddress)
      return list
    })

    const historicTradeList = await competitionAccountListQuery
    const priceMap = await priceMapQuery
    const tradeList: ITrade[] = historicTradeList.map(fromJson.tradeJson)

    return toAccountCompetitionSummary(tradeList, priceMap, queryParams.maxCollateral, to)
  }),
  awaitPromises
)

export const competitionAccountList = O(
  map((queryParams: IRequestCompetitionLadderApi) => {

    const competitionAccountListQuery = fetchHistoricTrades({ ...queryParams, offset: 0 }, async (params) => {
      const res = await arbitrumGraphDev(gql(`
query {
  trades(first: 1000, skip: ${params.offset}, where: { entryReferralCode: "${queryParams.referralCode}", timestamp_gte: ${params.from}, timestamp_lte: ${params.to}}) {
      ${tradeFields}
  }
}
`), {})

      return res.trades as ITrade[]
    })


    return competitionAccountListQuery
  }),
  awaitPromises
)




export const fetchTrades = async <T extends IRequestPagePositionApi & IChainParamApi, R>(params: T, getList: (res: T) => Promise<R[]>): Promise<R[]> => {
  const list = await getList(params)

  const nextOffset = params.offset + 1000

  if (nextOffset > 5000) {
    console.warn(`query has exceeded 5000 offset at timefram ${intervalTimeMap.DAY7}`)
    return list
  }

  if (list.length === 1000) {
    const newPage = await fetchTrades({ ...params, offset: nextOffset }, getList)

    return [...list, ...newPage]
  }

  return list
}

export const fetchHistoricTrades = async <T extends IRequestPagePositionApi & IChainParamApi & IRequestTimerangeApi, R>(params: T, getList: (res: T) => Promise<R[]>): Promise<R[]> => {
  const deltaTime = params.to - params.from

  // splits the queries because the-graph's result limit of 5k items
  if (deltaTime >= intervalTimeMap.DAY7) {
    const splitDelta = Math.floor(deltaTime / 2)
    const query0 = fetchHistoricTrades({ ...params, to: params.to - splitDelta, offset: 0 }, getList)
    const query1 = fetchHistoricTrades({ ...params, from: params.to - splitDelta, offset: 0 }, getList)

    return (await Promise.all([query0, query1])).flatMap(res => res)
  }


  return fetchTrades(params, getList)
}



async function querySubgraph<T extends IChainParamApi>(params: T, document: string): Promise<any> {
  return subgraphChainMap[params.chain](gql(document) as any, {})
}


// export async function createDocument<T>(entity: string, where: T): Promise<any> {
//   return `
//       {
//         ${entity}(first: 1000, orderBy: timestamp, orderDirection: asc, where: {tokenAddress: _${queryParams.tokenAddress}, interval: _${queryParams.interval}, timestamp_gte: ${queryParams.from}, timestamp_lte: ${queryParams.to || unixTimestampNow()} }) {
//           ${pricefeedFields}
//         }
//       }
// `
// }


const increasePositionFields = `
  id
  timestamp
  account
  collateralToken
  indexToken
  isLong
  key
  collateralDelta
  sizeDelta
  fee
  price
`
const decreasePositionFields = `
  id
  timestamp
  account
  collateralToken
  indexToken
  isLong
  key
  collateralDelta
  sizeDelta
  fee
  price
`
const updatePositionFields = `
  id
  timestamp
  key
  size
  markPrice
  collateral
  reserveAmount
  realisedPnl
  averagePrice
  entryFundingRate
`
const closePositionFields = `
  id
  timestamp
  key
  size
  collateral
  reserveAmount
  realisedPnl
  averagePrice
  entryFundingRate
`
const liquidatePositionFields = `
  id
  timestamp
  key
  account
  collateralToken
  indexToken
  isLong
  size
  collateral
  reserveAmount
  realisedPnl
  markPrice
`

const tradeFields = `
  id
  timestamp
  account
  collateralToken
  indexToken
  isLong
  key
  status

  increaseList(first: 1000) { ${increasePositionFields} }
  decreaseList(first: 1000) { ${decreasePositionFields} }
  updateList(first: 1000) { ${updatePositionFields} }

  sizeDelta
  collateralDelta
  fee
  size
  collateral
  averagePrice

  realisedPnl
  realisedPnlPercentage
  settledTimestamp
  closedPosition { ${closePositionFields} }
  liquidatedPosition { ${liquidatePositionFields} }
`
const pricefeedFields = `
  id
  timestamp
  o
  h
  l
  c
  tokenAddress
  interval
`



