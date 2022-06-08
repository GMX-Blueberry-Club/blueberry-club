import { groupByMapMany, IAccountQueryParamApi, intervalTimeMap, IPagePositionParamApi, ITimerangeParamApi } from "@gambitdao/gmx-middleware"
import { ClientOptions, createClient, gql, TypedDocumentNode } from "@urql/core"
import { ILabItemOwnership, IOwner, IPriceInterval, IProfile, IToken } from "@gambitdao/gbc-middleware"


export interface ITypename<T extends string> {
  __typename: T
}

export enum PricefeedAddress {
  // ARBITRUM
  _0x321F653eED006AD1C29D174e17d96351BDe22649,  //  GLP
  _0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a,  //  GMX
  _0x82af49447d8a07e3bd95bd0d56f35241523fbab1,  //  WETH

  // AVALANCHE
  _0xe1ae4d4b06A5Fe1fc288f6B4CD72f9F8323B107F,  //  GLP
  _0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7,  //  AVAX
}

export interface IStakingDelta {
  time: number
  valueUsd: bigint
  deltaUsd: bigint
  priceUsd: bigint
  amount: bigint
}

export enum StakedTokenArbitrum {
  GMX = "0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a",
  esGMX = "0xf42ae1d54fd613c9bb14810b0588faaa09a426ca",
  GLP = "0x1addd80e6039594ee970e5872d247bf0414c8903",
}

export enum StakedTokenAvalanche {
  GMX = "0x62edc0692bd897d2295872a9ffcac5425011c661",
  esGMX = "0xff1489227bbaac61a9209a08929e4c2a526ddd17",
  GLP = "0x01234181085565ed162a948b6a5e88758cd7c7b8",
}

export interface IStakeSource<T extends string> extends ITypename<T> {
  id: string
  account: string
  amount: bigint
  amountUsd: bigint
  timestamp: number
}

export interface IStake extends IStakeSource<"Stake"> {
  token: StakedTokenArbitrum | StakedTokenAvalanche
}


export interface IGlpStat {
  glpSupply: bigint
  aumInUsdg: bigint
  period: string
  id: string
  distributedEth: bigint
  __typename: "GlpStat"
}


export interface IPricefeedLatest {
  id: string
  feed: string
  value: bigint
  
  timestamp: number
  __typename: "PricefeedHistory"
}

export type IPriceFeedMap = {
  eth: IPricefeed[]
  glpArbitrum: IPricefeed[]
  glpAvalanche: IPricefeed[]
  gmx: IPricefeed[]
  avax: IPricefeed[]
}

export type ILatestPriceMap = {
  eth: IPricefeedLatest
  glpArbitrum: IPricefeedLatest
  glpAvalanche: IPricefeedLatest
  gmx: IPricefeedLatest
  avax: IPricefeedLatest
}


export interface IPricefeed extends IPriceInterval {
  id: string
  feed: PricefeedAddress
  interval: number
  period: string
  __typename: "PricefeedHistory"
}

export interface ITransfer<T extends string> extends ITypename<T> {
  from: string
  id: string
  timestamp: number
  to: string
  value: bigint
}
export interface IStakingGlpTransfer extends ITransfer<"StakeGlp"> {}
export interface IStakingGmxTransfer extends ITransfer<"StakeGmx"> {}


export interface IStakingClaim<T extends string> extends IStakeSource<T> {
  receiver: string
}


export interface IStakingGmxClaim extends IStakingClaim<"StakedGmxTrackerClaim"> {}
export interface IStakingGlpClaim extends IStakingClaim<"StakedGlpTrackerClaim"> {}
export interface IFeeGmxClaim extends IStakingClaim<"FeeGmxTrackerClaim"> {}
export interface IFeeGlpClaim extends IStakingClaim<"FeeGlpTrackerClaim"> {}

export type IAllFeeRewards = IFeeGmxClaim | IFeeGlpClaim
// export type IAllRewards = IStakeGlp | IUnStakeGlp | IStakeGmx | IUnStakeGmx | IAllFeeRewards

const schemaFragments = `

fragment tokenFields on Token {
  id
  owner { ...ownerFields }
  uri
  transfers { ...transferFields }
  
  contract { ...contractFields }
}

fragment ownerFields on Owner {
  id
  ownedTokens
  balance
}

fragment contractFields on Contract {
  id
  name
  symbol
  totalSupply
  mintedTokens
}

fragment transferFields on Transfer {
  id
  from {...ownerFields}
  to {...ownerFields}
  timestamp

  transaction {
    id
  }
}

`

export type QueryAccount = {
  account: string
}

export type QueryAccountOwnerNfts = QueryAccount

export type QueryIdentifiable = {
  id: string
}

export type IQueryGmxEthHistoricPrice = Partial<ITimerangeParamApi & { period: intervalTimeMap }>

const tokenDoc: TypedDocumentNode<{token: IToken | null}, QueryIdentifiable> = gql`
${schemaFragments}

query ($id: String) {
  token(id: $id) {
    ...tokenFields,
    labItems {
      item {
        id
      }
    }
  }
}

`



const gmxGlpEthHistoricPriceDoc: TypedDocumentNode<{ gmx: IPricefeed[], glpArbitrum: IPricefeed[], eth: IPricefeed[] }, IQueryGmxEthHistoricPrice> = gql`
query ($first: Int = 1000, $period: IntervalTime = _86400, $from: Int = 0, $to: Int = 1999999999) {
  glpArbitrum: pricefeeds(first: $first, where: {timestamp_gt: $from, timestamp_lt: $to, interval: $period, feed: _0x321F653eED006AD1C29D174e17d96351BDe22649}) {
    id
    feed
    o
    h
    l
    c
    timestamp
    interval
  }
  gmx: pricefeeds(first: $first, where: {timestamp_gt: $from, timestamp_lt: $to, interval: $period, feed: _0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a}) {
    id
    feed
    o
    h
    l
    c
    timestamp
    interval
  }
  eth: pricefeeds(first: $first, where: {timestamp_gt: $from, timestamp_lt: $to, interval: $period, feed: _0x82af49447d8a07e3bd95bd0d56f35241523fbab1}) {
    id
    feed
    o
    h
    l
    c
    timestamp
    interval
  }
}
`

const avalancheHistoricPriceDoc: TypedDocumentNode<{ avax: IPricefeed[], glpAvalanche: IPricefeed[] }, IQueryGmxEthHistoricPrice> = gql`

query ($first: Int = 1000, $period: IntervalTime = _86400, $from: Int = 0, $to: Int = 1999999999) {
  avax: pricefeeds(first: $first, where: {timestamp_gt: $from, timestamp_lt: $to, interval: $period, feed: _0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7}) {
    id
    feed
    o
    h
    l
    c
    timestamp
    interval
  }
  glpAvalanche: pricefeeds(first: $first, where: {timestamp_gt: $from, timestamp_lt: $to, interval: $period, feed: _0xe1ae4d4b06A5Fe1fc288f6B4CD72f9F8323B107F}) {
    id
    feed
    o
    h
    l
    c
    timestamp
    interval
  }
}


`



const arbitrumLatestPrices: TypedDocumentNode<{ gmx: IPricefeedLatest, glpArbitrum: IPricefeedLatest, eth: IPricefeedLatest }, {}> = gql`
query {
  eth: priceLatest(id: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1") {
    id
    value
    timestamp
  }
  gmx: priceLatest(id: "0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a") {
    id
    value
    timestamp
  }
  glpArbitrum: priceLatest(id: "0x321F653eED006AD1C29D174e17d96351BDe22649") {
    id
    value
    timestamp
  }
}
`

const avalancheLatestPrices: TypedDocumentNode<{ avax: IPricefeedLatest, glpAvalanche: IPricefeedLatest }, {}> = gql`
query {
  avax: priceLatest(id: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7") {
    id
    value
    timestamp
  }
  glpAvalanche: priceLatest(id: "0xe1ae4d4b06A5Fe1fc288f6B4CD72f9F8323B107F") {
    id
    value
    timestamp
  }
}

`


const ownerTransferList: TypedDocumentNode<{owner: IOwner}, QueryAccountOwnerNfts> = gql`
${schemaFragments}

query ($first: Int = 1000, $account: String) {
  owner(id: $account) {
    ownedTokens(first: $first) {
      transfers {
        transaction {
          id
        }
        id
        from {
          id
        }
      }
      uri
      id
    }
    balance
  }
}
`


const ownerV2: TypedDocumentNode<{owner: IOwner}, QueryAccountOwnerNfts> = gql`
${schemaFragments}

query ($account: String) {
  owner(id: $account) {
    id
    balance
    ownedLabItems(first: 1000) {
      balance
      item {
        id
      }
      id
    }
    displayName
    rewardClaimedCumulative
    ownedTokens(first: 1000) {
      id
      labItems {
        id
        item {
          id
        }
      }
    }
    profile {
      token {
        id
        labItems {
          item {
            id
          }
        }
      }
      name
    }
  }
}
`

const ownerListDoc: TypedDocumentNode<{owners: IOwner[]}, {}> = gql`
${schemaFragments}

query {
  owners(first: 1000) {
    id
    balance
    ownedLabItems {
      balance
      item {
        id
      }
      id
    }
    displayName
    rewardClaimedCumulative
    ownedTokens {
      id
      labItems {
        id
        item {
          id
        }
      }
    }
    profile {
      token {
        id
        labItems {
          item {
            id
          }
        }
      }
      name
    }
  }
}
`

const tokenV2: TypedDocumentNode<{ token: IToken }, QueryIdentifiable> = gql`
${schemaFragments}

query ($id: String) {
  token(id: $id) {
    id
    owner {
      id
      balance
      ownedLabItems(first: 1000) {
        balance
        item {
          id
        }
        id
      }
      displayName
      rewardClaimedCumulative
      ownedTokens(first: 1000) {
        id
        labItems {
          id
          item {
            id
          }
        }
      }
      profile {
        token {
          id
          labItems {
            item {
              id
            }
          }
        }
        name
      }
    }
    transfers {
      ...transferFields
    }
    labItems {
      id
      item {
        id
      }
    }
  }
}
`
const profileList: TypedDocumentNode<{ profiles: IProfile[] }, Partial<IPagePositionParamApi>> = gql`

query ($pageSize: Int = 1000, $skip: Int = 0) {
  profiles(first: $pageSize, skip: $skip, orderBy: timestamp, orderDirection: desc) {
    id
    timestamp
    token {
      id
      labItems {
        item {
          id
        }
      }
    }
    name
  }
}

`

const profileDoc: TypedDocumentNode<{ profile: IProfile }, QueryIdentifiable> = gql`

query ($id: String) {
  profile(id: $id) {
    id
    timestamp
    token {
      id
      labItems {
        item {
          id
        }
      }
    }
    name
  }
}

`


const trasnfer = `
  from
  id
  timestamp
  to
  value
`
const claim = `
  id
  timestamp
  receiver
  amount
  amountUsd
`


const rewardsTrackerDoc: TypedDocumentNode<{
  stakedGmxTrackerClaims: IStakingGmxClaim[],
  stakedGlpTrackerClaims: IStakingGlpClaim[],

  stakes: IStake[],


  // stakeGmxes: IStakeGmx[],
  // unstakeGmxes: IUnStakeGmx[],

  // stakeGlps: IStakeGlp[],
  // unstakeGlps: IUnStakeGlp[],

  feeGmxTrackerClaims: IFeeGmxClaim[],
  feeGlpTrackerClaims: IFeeGlpClaim[],
  feeGmxTrackerTransfers: IStakingGmxTransfer[],
  feeGlpTrackerTransfers: IStakingGlpTransfer[],
  // bonusGmxTrackerTransfers: ITransfer[]
}, IAccountQueryParamApi & Partial<ITimerangeParamApi>> = gql`

query ($first: Int = 1000, $account: String, $period: IntervalTime = _86400, $from: Int = 0, $to: Int = 1999999999) {

  stakes(first: $first, orderBy: timestamp, orderDirection: desc, where:{account: $account, timestamp_gte: $from, timestamp_lte: $to}) {
    account
    amount
    amountUsd
    token
    timestamp
    id
  }


  feeGmxTrackerClaims(first: $first, orderBy: timestamp, orderDirection: desc, where:{receiver: $account, timestamp_gte: $from, timestamp_lte: $to}) {
    ${claim}
  }

  feeGlpTrackerClaims(first: $first, orderBy: timestamp, orderDirection: desc, where:{receiver: $account, timestamp_gte: $from, timestamp_lte: $to}) {
    ${claim}
  }

  stakedGmxTrackerClaims(first: $first, orderBy: timestamp, orderDirection: desc, where:{receiver: $account, timestamp_gte: $from, timestamp_lte: $to}) {
    ${claim}
  }

  stakedGlpTrackerClaims(first: $first, orderBy: timestamp, orderDirection: desc, where:{receiver: $account, timestamp_gte: $from, timestamp_lte: $to}) {
    ${claim}
  }

  bonusGmxTrackerTransfers(first: $first, orderBy: timestamp, orderDirection: desc, where:{to: $account, timestamp_gte: $from, timestamp_lte: $to}) {
    ${trasnfer}
  }
}


`





const prepareClient = (opts: ClientOptions) => {

  const client = createClient(opts)

  return async <Data, Variables extends object = {}>(document: TypedDocumentNode<Data, Variables>, params: Variables): Promise<Data> => {
    const result = await client.query(document, params)
      .toPromise()
  
    if (result.error) {
      throw new Error(result.error.message)
    }
  
    return result.data!
  }
}

const blueberryGraph = prepareClient({
  fetch: fetch,
  url: 'https://api.thegraph.com/subgraphs/name/nissoh/blueberry-club',
})

const blueberryGraphV2 = prepareClient({
  fetch: fetch,
  url: 'https://api.thegraph.com/subgraphs/name/nissoh/blueberry-club-arbitrum',
})


const gmxAvalancheStats = prepareClient({
  fetch: fetch,
  url: 'https://api.thegraph.com/subgraphs/name/nissoh/gmx-staking-avalanche',
})

const gmxArbitrumStats = prepareClient({
  fetch: fetch,
  url: 'https://api.thegraph.com/subgraphs/name/nissoh/gmx-rewards',
})


export const queryProfileList = async (queryParams: Partial<IPagePositionParamApi> = {}) => {
  const owner = (await blueberryGraphV2(profileList, queryParams)).profiles

  return owner.map(fromProfileJson).reverse()
}

export const queryProfile = async (queryParams: QueryIdentifiable) => {
  const owner = (await blueberryGraphV2(profileDoc, queryParams)).profile

  return fromProfileJson(owner)
}


export const queryOwnerTrasnferNfts = async (account: string) => {
  const owner = (await blueberryGraph(ownerTransferList, { account: account.toLowerCase() })).owner

  if (owner === null) {
    return []
  }

  return Object.entries(groupByMapMany(owner.ownedTokens, token => token.transfers[0].transaction.id))
}

export const queryOwnerList = async (): Promise<IOwner[]> => {
  const owners = (await blueberryGraphV2(ownerListDoc, {  })).owners


  return owners.map(fromOwnerJson)
}

export const queryOwnerV2 = async (account: string): Promise<IOwner | null> => {
  const owner = (await blueberryGraphV2(ownerV2, { account: account.toLowerCase() })).owner

  if (owner === null) {
    return null
  }

  return fromOwnerJson(owner)
}
 
export const queryToken = async (id: string) => {
  const owner = (await blueberryGraph(tokenDoc, { id })).token

  if (owner === null) {
    throw new Error(`Token #${id} not found`)
  }

  return owner
}

export const queryTokenv2 = async (id: string) => {
  const owner = (await blueberryGraphV2(tokenV2, { id })).token

  if (owner === null) {
    throw new Error(`Token #${id} not found`)
  }

  return fromTokenJson(owner)
}



export const gmxGlpPriceHistory = async ({ from, to, period }: IQueryGmxEthHistoricPrice = {}): Promise<IPriceFeedMap> => {
  const queryArbi = gmxArbitrumStats(gmxGlpEthHistoricPriceDoc, { from, to, period })
  const queryAvax = gmxAvalancheStats(avalancheHistoricPriceDoc, { from, to, period })
  const { eth, glpArbitrum, gmx } = (await queryArbi)
  const { avax, glpAvalanche } = (await queryAvax)

  return {
    eth: eth.map(fromPricefeedJson),
    glpArbitrum: glpArbitrum.map(fromPricefeedJson),
    glpAvalanche: glpAvalanche.map(fromPricefeedJson).filter(x => x.c > 0n),
    gmx: gmx.map(fromPricefeedJson),
    avax: avax.map(fromPricefeedJson),
  }
}

export const queryLatestPrices = async (): Promise<ILatestPriceMap> => {
  const queryArbi = gmxArbitrumStats(arbitrumLatestPrices, {})
  const queryAvax = gmxAvalancheStats(avalancheLatestPrices, {})
  const { eth, glpArbitrum, gmx } = await queryArbi
  const { glpAvalanche, avax } = await queryAvax


  return {
    gmx: fromLatestPriceJson(gmx),
    eth: fromLatestPriceJson(eth),
    avax: fromLatestPriceJson(avax),
    glpArbitrum: fromLatestPriceJson(glpArbitrum),
    glpAvalanche: fromLatestPriceJson(glpAvalanche),
  }
}

export const queryArbitrumRewards = async (config: IAccountQueryParamApi & Partial<ITimerangeParamApi>) => {
  const data = (await gmxArbitrumStats(rewardsTrackerDoc, config))


  const stakedGlpTrackerClaims = data.stakedGlpTrackerClaims.map(fromYieldSourceJson)
  const stakedGmxTrackerClaims = data.stakedGmxTrackerClaims.map(fromYieldSourceJson)
  const feeGlpTrackerClaims = data.feeGlpTrackerClaims.map(fromYieldSourceJson)
  const feeGmxTrackerClaims = data.feeGmxTrackerClaims.map(fromYieldSourceJson)

  const stakes = data.stakes.map(fromStakeJson)

  return { stakedGlpTrackerClaims, stakedGmxTrackerClaims, feeGlpTrackerClaims, feeGmxTrackerClaims, stakes }
}


export const queryAvalancheRewards = async (config: IAccountQueryParamApi & Partial<ITimerangeParamApi>) => {
  const data = (await gmxAvalancheStats(rewardsTrackerDoc, config))

  const stakedGlpTrackerClaims = data.stakedGlpTrackerClaims.map(fromYieldSourceJson)
  const stakedGmxTrackerClaims = data.stakedGmxTrackerClaims.map(fromYieldSourceJson)
  const feeGlpTrackerClaims = data.feeGlpTrackerClaims.map(fromYieldSourceJson)
  const feeGmxTrackerClaims = data.feeGmxTrackerClaims.map(fromYieldSourceJson)

  const stakes = data.stakes.map(fromStakeJson)

  return { stakedGlpTrackerClaims, stakedGmxTrackerClaims, feeGlpTrackerClaims, feeGmxTrackerClaims, stakes }
}


function fromProfileJson(obj: IProfile): IProfile {
  return {
    ...obj,
    token: obj.token ? fromTokenJson(obj.token) : null
  }
}

function fromLabItemOwnershipJson(obj: ILabItemOwnership): ILabItemOwnership {
  return {
    ...obj,
    item: {
      ...obj.item,
      id: Number(obj.item.id)
    }
  }
}

function fromTokenJson<T extends IToken>(obj: T): T {
  return {
    ...obj,
    labItems: obj.labItems.map(fromLabItemOwnershipJson),
    owner: obj.owner ? fromOwnerJson(obj.owner) : null,
    id: Number(obj.id)
  }
}

function fromOwnerJson<T extends IOwner>(obj: T): T {
  const ownedTokens = obj.ownedTokens.map(t => fromTokenJson(t))
  return {
    ...obj,
    main: obj.profile ? fromProfileJson(obj.profile) : null,
    ownedTokens,
    ownedLabItems: obj.ownedLabItems.map(json => ({ ...json, balance: BigInt(json.balance), item: { id: Number(json.item.id) } }))
  }
}


function fromYieldSourceJson<K extends string, T extends IStakeSource<K>>(obj: T): T {
  return {
    ...obj,
    amount: BigInt(obj.amount),
    amountUsd: BigInt(obj.amountUsd),
  }
}

function fromStakeJson<T extends IStake>(obj: T): T {
  return {
    ...fromYieldSourceJson(obj),
    token: obj.token.slice(1)
  }
}

function fromLatestPriceJson<T extends IPricefeedLatest>(obj: T): T {
  return {
    ...obj,
    value: BigInt(obj.value),
  }
}


function fromPricefeedJson(obj: IPricefeed): IPricefeed {
  return {
    ...obj,
    o: BigInt(obj.o),
    h: BigInt(obj.h),
    l: BigInt(obj.l),
    c: BigInt(obj.c),
  }
}
