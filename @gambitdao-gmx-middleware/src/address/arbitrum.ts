

export enum ARBITRUM_ADDRESS {
  NATIVE_TOKEN = "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
  WBTC = "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
  LINK = "0xf97f4df75117a78c1a5a0dbb814af92458539fb4",
  UNI = "0xfa7f8980b0f1e64a2062791cc3b0871572f1f7f0",

  USDC = "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
  USDT = "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
  DAI = "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
  MIM = "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
  FRAX = "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F",

  Vault = "0x489ee077994B6658eAfA855C308275EAd8097C4A",
  VaultPriceFeed = "0x2d68011bcA022ed0E474264145F46CC4de96a002",
  Router = "0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064",
  VaultReader = "0xfebB9f4CAC4cD523598fE1C5771181440143F24A",
  Reader = "0xF09eD52638c22cc3f1D7F5583e3699A075e601B2",
  GlpManager = "0x321F653eED006AD1C29D174e17d96351BDe22649",
  RewardRouter = "0xc73d553473dC65CE56db96c58e6a091c20980fbA",
  RewardReader = "0xe725Ad0ce3eCf68A7B93d8D8091E83043Ff12e9A",

  GLP = "0x4277f8f2c384827b5273592ff7cebd9f2c1ac258",
  GMX = "0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a",
  ES_GMX = "0xf42Ae1D54fd613C9bb14810b0588FaAa09a426cA",
  BN_GMX = "0x35247165119B69A40edD5304969560D0ef486921",
  USDG = "0x45096e7aA921f27590f8F19e457794EB09678141",

  StakedGmxTracker = "0x908C4D94D34924765f1eDc22A1DD098397c59dD4",
  BonusGmxTracker = "0x4d268a7d4C16ceB5a606c173Bd974984343fea13",
  FeeGmxTracker = "0xd2D1162512F927a7e282Ef43a362659E4F2a728F",
  FeeGlpTracker = "0x4e971a87900b931fF39d1Aad67697F49835400b6",
  StakedGlpTracker = "0x1aDDD80E6039594eE970E5872D247bf0414C8903",

  StakedGmxDistributor = "0x23208B91A98c7C1CD9FE63085BFf68311494F193",
  StakedGlpDistributor = "0x60519b48ec4183a61ca2B8e37869E675FD203b34",

  GmxVester = "0x199070DDfd1CFb69173aa2F7e20906F26B363004",
  GlpVester = "0xA75287d2f8b217273E7FCD7E86eF07D33972042E",

  OrderBook = "0x09f77E8A13De9a35a7231028187e9fD5DB8a2ACB",
  OrderExecutor = "0x7257ac5D0a0aaC04AA7bA2AC0A6Eb742E332c3fB",
  OrderBookReader = "0xa27C20A7CF0e1C68C0460706bB674f98F362Bc21",

  FastPriceFeed = "0x1a0ad27350cccd6f7f168e052100b4960efdb774",
  PositionRouter = "0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868",
  PositionManager = "0x87a4088Bd721F83b6c2E5102e2FA47022Cb1c831",

}

export type ARBITRUM_ADDRESS_INDEX = ARBITRUM_ADDRESS.NATIVE_TOKEN | ARBITRUM_ADDRESS.WBTC | ARBITRUM_ADDRESS.LINK | ARBITRUM_ADDRESS.UNI
export type ARBITRUM_ADDRESS_STABLE = ARBITRUM_ADDRESS.USDC | ARBITRUM_ADDRESS.USDT | ARBITRUM_ADDRESS.DAI | ARBITRUM_ADDRESS.MIM | ARBITRUM_ADDRESS.FRAX
