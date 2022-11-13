import { BASIS_POINTS_DIVISOR, FUNDING_RATE_PRECISION, LEVERAGE_LIQUIDAITON, LIQUIDATION_FEE, MARGIN_FEE_BASIS_POINTS, MAX_LEVERAGE } from "./constant"
import { IAccountSummary, ITrade, IClaim, IClaimSource, IPositionClose, IPositionLiquidated, IAbstractPositionStake, ITradeSettled, ITradeClosed, ITradeLiquidated, ITradeOpen, TradeStatus, TokenDescription } from "./types"
import { formatFixed, getDenominator, groupByMapMany, isAddress } from "./utils"



export function getPositionCumulativeFundingFee(size: bigint, fundingRate: bigint) {
  return size * fundingRate / FUNDING_RATE_PRECISION
}

export function div(a: bigint, b: bigint): bigint {
  if (b === 0n) {
    return 0n
  }

  return a * BASIS_POINTS_DIVISOR / b
}

export function bnDiv(a: bigint, b: bigint): number {
  return formatFixed(div(a, b), 4)
}

export function formatToBasis(a: bigint): number {
  return formatFixed(a, 4)
}



export function getPriceDeltaPercentage(positionPrice: bigint, price: bigint) {
  const priceDelta = price - positionPrice

  return priceDelta / positionPrice
}

export function getDelta(n: bigint, nChange: bigint, size: bigint) {
  const priceDelta = n > nChange ? n - nChange : nChange - n

  return size * priceDelta / n
}

export function getPnL(isLong: boolean, averagePrice: bigint, priceChange: bigint, size: bigint) {
  const priceDelta = averagePrice > priceChange ? averagePrice - priceChange : priceChange - averagePrice
  const hasProfit = isLong ? priceChange > averagePrice : averagePrice > priceChange
  const delta = size * priceDelta / averagePrice

  return hasProfit ? delta : -delta
}

export function getDeltaPercentage(delta: bigint, collateral: bigint) {
  return delta * BASIS_POINTS_DIVISOR / collateral
}

export function getAveragePriceFromDelta(islong: boolean, size: bigint, price: bigint, pnl: bigint, sizeDelta: bigint) {
  const nextSize = size + sizeDelta
  const hasProfit = pnl > 0n

  if (islong) {
    const divisor = hasProfit ? nextSize + pnl : nextSize - pnl

    return price * nextSize / divisor
  }

  const divisor = hasProfit ? nextSize - pnl : nextSize + pnl

  return price * nextSize / divisor
}


export function getTokenAmount(amountUsd: bigint, price: bigint, tokenDescription: TokenDescription) {
  return amountUsd * getDenominator(tokenDescription.decimals) / price
}

export function getTokenUsd(amount: bigint, price: bigint, decimals: number) {
  return amount * price / getDenominator(decimals)
}


export function getMarginFees(size: bigint) {
  return size * MARGIN_FEE_BASIS_POINTS / BASIS_POINTS_DIVISOR
}


export function getLiquidationPriceFromDelta(liquidationAmount: bigint, size: bigint, collateral: bigint, averagePrice: bigint, isLong: boolean) {
  if (liquidationAmount > collateral) {
    const liquidationDelta = liquidationAmount - collateral
    const priceDelta = size ? liquidationDelta * averagePrice / size : 0n
    return isLong ? averagePrice + priceDelta : averagePrice - priceDelta
  }

  const liquidationDelta = collateral - liquidationAmount
  const priceDelta = size ? liquidationDelta * averagePrice / size : 0n

  return isLong ? averagePrice - priceDelta : averagePrice + priceDelta
}


export function getLiquidationPrice(
  isLong: boolean,
  size: bigint,
  collateral: bigint,
  averagePrice: bigint,

  entryFundingRate = 0n,
  cumulativeFundingRate = 0n,
  pnl = 0n,

  sizeDelta = 0n,
  collateralDelta = 0n,
) {
  const adjustedDelta = size ? sizeDelta * pnl / size : 0n

  const nextSize = size + sizeDelta
  const remainingCollateral = (pnl < 0n ? collateral - adjustedDelta : collateral) + collateralDelta


  const fundingFee = (size * cumulativeFundingRate - entryFundingRate) / FUNDING_RATE_PRECISION
  const positionFee = getMarginFees(size) + LIQUIDATION_FEE + fundingFee


  const liquidationPriceForFees = getLiquidationPriceFromDelta(
    positionFee,
    nextSize,
    remainingCollateral,
    averagePrice,
    isLong,
  )

  const liquidationPriceForMaxLeverage = getLiquidationPriceFromDelta(
    nextSize * BASIS_POINTS_DIVISOR / MAX_LEVERAGE,
    nextSize,
    remainingCollateral,
    averagePrice,
    isLong,
  )


  if (isLong) {
    // return the higher price
    return liquidationPriceForFees > liquidationPriceForMaxLeverage
      ? liquidationPriceForFees
      : liquidationPriceForMaxLeverage
  }

  // return the lower price
  return liquidationPriceForMaxLeverage > liquidationPriceForFees
    ? liquidationPriceForFees
    : liquidationPriceForMaxLeverage

}


export function isTradeSettled(trade: ITrade): trade is ITradeSettled {
  return trade.status !== TradeStatus.OPEN
}

export function isTradeOpen(trade: ITrade): trade is ITradeOpen {
  return trade.status === TradeStatus.OPEN
}

export function isTradeLiquidated(trade: ITrade): trade is ITradeLiquidated {
  return trade.status === TradeStatus.LIQUIDATED
}

export function isTradeClosed(trade: ITrade): trade is ITradeClosed {
  return trade.status === TradeStatus.CLOSED
}

export function isPositionLiquidated(trade: IPositionClose | IPositionLiquidated): trade is IPositionLiquidated {
  return 'markPrice' in trade
}

// function getFundingFee(address /* _account */, address _collateralToken, address /* _indexToken */, bool /* _isLong */, uint256 _size, uint256 _entryFundingRate) public override view returns(uint256) {
//   if (_size == 0) { return 0; }

//         uint256 fundingRate = vault.cumulativeFundingRates(_collateralToken).sub(_entryFundingRate);
//   if (fundingRate == 0) { return 0; }

//   return _size.mul(fundingRate).div(FUNDING_RATE_PRECISION);
// }

export function getFundingFee(entryFundingRate: bigint, cumulativeFundingRate: bigint, size: bigint) {
  return (size * (cumulativeFundingRate - entryFundingRate)) / FUNDING_RATE_PRECISION
}


export function toAccountSummary(list: ITrade[]): IAccountSummary[] {
  const settledListMap = groupByMapMany(list, a => a.account)
  const allPositions = Object.entries(settledListMap)

  return allPositions.reduce((seed, [account, allSettled]) => {

    const seedAccountSummary: IAccountSummary = {
      claim: null,
      account,

      collateral: 0n,
      size: 0n,

      fee: 0n,
      realisedPnl: 0n,

      collateralDelta: 0n,
      sizeDelta: 0n,
      realisedPnlPercentage: 0n,

      winTradeCount: 0,
      settledTradeCount: 0,
      openTradeCount: 0,
    }

    const summary = allSettled.reduce((seed, next): IAccountSummary => {

      return {
        ...seed,
        fee: seed.fee + next.fee,
        collateral: seed.collateral + next.collateral,
        collateralDelta: seed.collateralDelta + next.collateralDelta,
        realisedPnl: seed.realisedPnl + next.realisedPnl,
        size: seed.size + next.size,
        sizeDelta: seed.sizeDelta + next.sizeDelta,
        realisedPnlPercentage: seed.realisedPnlPercentage + next.realisedPnlPercentage,

        winTradeCount: next.realisedPnl > 0n ? seed.winTradeCount + 1 : seed.winTradeCount,
        settledTradeCount: next.status === TradeStatus.CLOSED || next.status === TradeStatus.LIQUIDATED ? seed.settledTradeCount + 1 : seed.settledTradeCount,
        openTradeCount: next.status === TradeStatus.OPEN ? seed.openTradeCount + 1 : seed.openTradeCount,

      }
    }, seedAccountSummary)

    seed.push(summary)

    return seed
  }, [] as IAccountSummary[])
}



function easeInExpo(x: number) {
  return x === 0 ? 0 : Math.pow(2, 10 * x - 10)
}

export function liquidationWeight(isLong: boolean, liquidationPriceUSD: bigint, markPriceUSD: bigint) {
  const weight = isLong ? liquidationPriceUSD * BASIS_POINTS_DIVISOR / markPriceUSD : markPriceUSD * BASIS_POINTS_DIVISOR / liquidationPriceUSD
  const newLocal = formatFixed(weight, 4)
  const value = easeInExpo(newLocal)
  return value > 1 ? 1 : value
}


export function validateIdentityName(name: string) {
  if (typeof name === 'string' && name.startsWith('@') && !(/^@?(\w){1,15}$/.test(name))) {
    throw new Error('Invalid twitter handle')
  }

  if (typeof name !== 'string' || name.length > 15 || String(name).length < 4) {
    throw new Error('Invalid name')
  }

}

export function parseTwitterClaim(account: string, name: string): IClaim {
  if (!isAddress(account)) {
    throw new Error('Invalid address')
  }

  validateIdentityName(name)

  return {
    name,
    account,
    data: '',
    sourceType: IClaimSource.TWITTER
  }
}


