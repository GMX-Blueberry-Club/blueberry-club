import { Behavior, combineObject } from '@aelea/core'
import { $element, $node, $text, attr, component, style } from "@aelea/dom"
import { Route } from '@aelea/router'
import { $card, $column, $row, $seperator, layoutSheet, screenUtils } from '@aelea/ui-components'
import { colorAlpha, pallete } from '@aelea/ui-components-theme'
import { empty, map, mergeArray, now, zip } from '@most/core'
import { Stream } from '@most/types'
import { formatReadableUSD, formatFixed, unixTimestampNow, IRequestCompetitionLadderApi, IAccountLadderSummary, BASIS_POINTS_DIVISOR, div } from '@gambitdao/gmx-middleware'
import { $alertTooltip, countdown } from './$rules'
import { IWalletLink } from '@gambitdao/wallet-link'
import { $accountPreview, $profilePreview } from '../../components/$AccountProfile'
import { BLUEBERRY_REFFERAL_CODE, IProfileTradingSummary, IProfileTradingResult, TOURNAMENT_START, TOURNAMENT_TIME_END, TOURNAMENT_NEXT } from '@gambitdao/gbc-middleware'
import { $anchor, $infoLabel, $infoTooltipLabel, $Link, ISortBy } from '@gambitdao/ui-components'
import { $CardTable } from '../../components/$common'
import { IProfileActiveTab } from '../$Profile'
import { $addToCalendar, $responsiveFlex } from '../../elements/$common'
import { $defaultBerry } from '../../components/$DisplayBerry'
import { $defaultProfileContainer } from '../../common/$avatar'

const MAX_COLLATERAL = 500000000000000000000000000000000n
const prizeRatioLadder: bigint[] = [3000n, 1500n, 750n, ...Array(17).fill(div(4750n, 17n) / BASIS_POINTS_DIVISOR)]


export interface ICompetitonCumulativeRoi {
  walletLink: IWalletLink
  parentRoute: Route
  competitionCumulative: Stream<IProfileTradingResult>
}



export const $CumulativeCompetition = (config: ICompetitonCumulativeRoi) => component((
  [routeChange, routeChangeTether]: Behavior<any, string>,
  [sortByChange, sortByChangeTether]: Behavior<ISortBy<IAccountLadderSummary>, ISortBy<IAccountLadderSummary>>,
  [pageIndex, pageIndexTether]: Behavior<number, number>,
) => {

  const tableList = map(res => res.list, config.competitionCumulative)

  const nowTime = unixTimestampNow()
  const ended = TOURNAMENT_START >= nowTime



  const sortBy: Stream<ISortBy<IAccountLadderSummary>> = mergeArray([
    now({ direction: 'desc', selector: 'roi' }),
    sortByChange
  ])


  return [
    $column(style({ flex: 1 }), screenUtils.isDesktopScreen ? layoutSheet.spacingBig : layoutSheet.spacing)(

      $column(screenUtils.isDesktopScreen ? layoutSheet.spacingBig : layoutSheet.spacing, style({ flexDirection: screenUtils.isDesktopScreen ? 'row' : 'column', alignItems: 'center', placeContent: 'center' }))(

        $row(layoutSheet.spacing)(
          $column(style({ alignItems: 'center' }))(
            $row(layoutSheet.spacingSmall, style({ alignItems: 'baseline' }))(
              $text(style({ fontSize: '1.95em', fontWeight: 'bold', color: pallete.primary, textShadow: `1px 1px 20px ${colorAlpha(pallete.primary, .25)}, 1px 1px 50px ${colorAlpha(pallete.primary, .25)} ` }))('#TopBlueberry'),
            ),
            $infoTooltipLabel(
              $column(layoutSheet.spacingSmall)(
                $text(`ROI (%) is defined as:`),
                $text(style({ fontSize: '.75em', fontStyle: 'italic' }))(`Profits / Max Collateral (min ${formatReadableUSD(MAX_COLLATERAL)}) * 100`),
                $text(`To participate:`),
                $element('ul')(
                  $element('li')(
                    $text('Own a GBC')
                  ),
                  $element('li')(
                    $text('Have a Lab Identity, go to Wardrobe, choose your GBC & click “Set PFP”')
                  ),
                  $element('li')(
                    $text('Start trading on GBC Trading or use/click '),
                    $anchor(attr({ href: 'https://gmx.io/?ref=BLUEBERRY' }))($text('BLUEBERRY')),
                    $text(' to opt our referral on GMX.io.')
                  ),
                ),
                $node(
                  $text('see '), $anchor(attr({ href: 'https://mirror.xyz/gbc.eth/gxgsTaz8nJyLP1NDUaw_vpnuwjR-2-j2mZfD1GKRtLQ' }))(
                    $text(`Full Competition Rules`)
                  ), $text(' for more details')
                ),
              ),
              $text(style({ fontWeight: 'bold', color: pallete.middleground }))(`Highest ROI (%)`)
            ),
          ),
        ),
        ended
          ? $column(
            $row(layoutSheet.spacingSmall, style({ alignItems: 'baseline' }))(
              $text(style({ fontSize: '1.25em', color: pallete.indeterminate }))('LIVE!'),
              $text(style({ color: pallete.foreground }))('Ending in')
            ),
            $text(style({ fontSize: '1.25em' }))(countdown(TOURNAMENT_START + TOURNAMENT_TIME_END))
          )
          : $row(layoutSheet.spacingSmall, style({ alignItems: 'center' }))(
            $addToCalendar({
              time: new Date(TOURNAMENT_START * 1000),
              title: 'Blueberry Trading Compeition',
              description: `Monthly trading competitions will be held. These tournaments will offer cash prizes, unique lab items, and more as rewards for traders who compete and win.  \n\n${document.location.href}`
            }),
            $column(
              $row(layoutSheet.spacingSmall, style({ alignItems: 'baseline' }))(
                $text(style({ fontSize: '1.25em' }))('Next Cycle!'),
                $text(style({ color: pallete.foreground }))('Starting in')
              ),
              $text(style({ fontSize: '1.25em' }))(countdown(TOURNAMENT_NEXT))
            )
          )
      ),


      $column(layoutSheet.spacing)(
        $row(layoutSheet.spacing, style({ alignItems: 'flex-end' }))(
          $column(layoutSheet.spacingSmall, style({ flex: 1, alignSelf: screenUtils.isMobileScreen ? 'center' : '' }))(
            $responsiveFlex(layoutSheet.spacingSmall)(
              $infoTooltipLabel($column(layoutSheet.spacingSmall)(
                $text('The total volume accumulated between the 1st and 28th of each competition period'),
                $text('Higher volume means a higher prize pool'),
              ), 'Traded Volume'),
              $text(map(res => {
                return formatReadableUSD(res.size)
              }, config.competitionCumulative))
            ),
          ),

          $responsiveFlex(layoutSheet.spacingSmall, style({ placeContent: 'flex-end', alignItems: 'flex-end' }))(
            style({ flexDirection: 'row-reverse' })(
              $infoTooltipLabel(
                $column(layoutSheet.spacingSmall)(
                  $text('The current accumulated amount from the GMX referral program will be rewarded to the top traders at the end'),
                  $column(
                    $text('it is calculated as:'),
                    $text(style({ fontSize: '.75em', fontStyle: 'italic' }))('Traded Volume * .001 (Margin Fee) * .15 (BLUBERRY Referral)'),
                  )
                ),
                'Prize Pool'
              )
            ),
            $text(style({
              color: pallete.positive,
              fontSize: '1.65em',
              textShadow: `${pallete.positive} 1px 1px 15px`
            }))(map(params => formatReadableUSD(params.prizePool), config.competitionCumulative))
          ),
        ),

        $CardTable({
          dataSource: tableList,
          sortBy,
          columns: [
            {
              $head: $text('Account'),
              columnOp: style({ minWidth: '120px', flex: 2, alignItems: 'center' }),
              $$body: map((pos: IProfileTradingSummary) => {

                if (!pos.profile) {
                  return $row(layoutSheet.spacingSmall, style({ alignItems: 'center' }))(
                    $alertTooltip($text(`Account requires Lab Identity, prize will be passed to the next participant if remained unclaimed`)),
                    $Link({
                      $content: $accountPreview({ address: pos.account, $container: $defaultProfileContainer(style({ minWidth: '50px' })) }),
                      route: config.parentRoute.create({ fragment: 'fefwef' }),
                      url: `/p/profile/${pos.account}/${IProfileActiveTab.TRADING.toLowerCase()}`
                    })({ click: routeChangeTether() }),
                    // $anchor(clickAccountBehaviour)(
                    //   $accountPreview({ address: pos.account })
                    // )
                    // style({ zoom: '0.7' })(
                    //   $alert($text('Unclaimed'))
                    // )
                  )
                }


                const $container = pos.rank < 4
                  ? $defaultBerry(style(
                    {
                      width: '50px',
                      minWidth: '50px',
                      border: `1px solid ${pallete.message}`,
                      boxShadow: `${colorAlpha(pallete.positive, .4)} 0px 3px 20px 5px`
                    }
                    // pos.rank === 1 ? {
                    //   minWidth: '50px',
                    //   width: '60px',
                    //   border: `1px solid ${pallete.positive}`,
                    //   boxShadow: `${colorAlpha(pallete.positive, .4)} 0px 3px 20px 5px`
                    // }
                    //   : pos.rank === 2 ? {
                    //     minWidth: '50px',
                    //     width: '60px',
                    //     border: `1px solid ${pallete.indeterminate}`,
                    //     boxShadow: `${colorAlpha(pallete.indeterminate, .4)} 0px 3px 20px 5px`
                    //   }
                    //     : {
                    //       minWidth: '50px',
                    //       width: '60px',
                    //       border: `1px solid ${pallete.negative}`,
                    //       boxShadow: `${colorAlpha(pallete.negative, .4)} 0px 3px 20px 5px`
                    //     }

                  ))
                  : $defaultBerry(style({ width: '50px', minWidth: '50px', }))

                return $row(layoutSheet.spacingSmall, style({ alignItems: 'center', minWidth: 0, }))(
                  $row(style({ alignItems: 'baseline', zIndex: 5, textAlign: 'center', minWidth: '18px', placeContent: 'center' }))(
                    $text(style({ fontSize: '.75em' }))(`${pos.rank}`),
                  ),
                  $Link({
                    $content: $profilePreview({ profile: pos.profile, $container }),
                    route: config.parentRoute.create({ fragment: 'fefwef' }),
                    url: `/p/profile/${pos.account}/${IProfileActiveTab.TRADING.toLowerCase()}`
                  })({ click: routeChangeTether() }),
                )
              })
            },
            ...(screenUtils.isDesktopScreen ? [
              {
                $head: $text('Win / Loss'),
                columnOp: style({ maxWidth: '88px', alignItems: 'center', placeContent: 'center' }),
                $$body: map((pos: IProfileTradingSummary) => {
                  return $row(
                    $text(`${pos.winCount} / ${pos.lossCount}`)
                  )
                })
              },

            ] : []),
            {
              $head: $column(style({ textAlign: 'right' }))(
                $text('Profits'),
                $text(style({ fontSize: '.75em' }))('Max Collateral'),
              ),
              sortBy: 'pnl',
              columnOp: style({ placeContent: 'flex-end', minWidth: '90px' }),
              $$body: map((pos) => {
                const val = formatReadableUSD(pos.pnl, false)
                const isNeg = pos.pnl < 0n


                return $column(layoutSheet.spacingTiny, style({ textAlign: 'right' }))(
                  $text(style({ color: isNeg ? pallete.negative : pallete.positive }))(
                    val
                  ),
                  $seperator,
                  $text(style({ fontSize: '.75em' }))(formatReadableUSD(pos.maxCollateral, false))
                )
              })
            },
            {
              $head: $column(style({ placeContent: 'flex-end' }))(
                $text('Prize'),
                $text(style({ fontSize: '.75em' }))('ROI'),
              ),
              sortBy: 'roi',
              columnOp: style({ minWidth: '90px', placeContent: 'flex-end' }),
              $$body: zip((prizePool, pos) => {
                const prizeRatio = prizeRatioLadder[pos.rank - 1]

                // const prizeRatio = easeInExpo()
                // const usd1k = 10n ** 30n * 1000n
                // const particiapnts = formatFixed(prizePool / usd1k, 30)
                // total = rewards[i] = ((i + 1) ** 2) / total



                return $column(layoutSheet.spacingTiny, style({ alignItems: 'flex-end' }))(
                  prizeRatio
                    ? $row(
                      // $avaxIcon,
                      $text(style({ fontSize: '1.25em', color: pallete.positive }))(formatReadableUSD(prizePool.prizePool * prizeRatio / BASIS_POINTS_DIVISOR, false)),
                    ) : empty(),

                  $text(`${formatFixed(pos.roi, 2)}%`)
                )
              }, config.competitionCumulative)
              // $$body: zip((prizePool, pos) => {
              //   const prizeRatio = prizeRatioLadder[pos.rank - 1]

              //   // const prizeRatio = easeInExpo()
              //   // const usd1k = 10n ** 30n * 1000n
              //   // const particiapnts = formatFixed(prizePool / usd1k, 30)
              //   // total = rewards[i] = ((i + 1) ** 2) / total



              //   return $column(layoutSheet.spacingTiny, style({ alignItems: 'flex-end' }))(
              //     prizeRatio
              //       ? $row(
              //         // $avaxIcon,
              //         $text(style({ fontSize: '1.25em', color: pallete.positive }))(formatReadableUSD(prizePool * prizeRatio / BASIS_POINTS_DIVISOR)),
              //       ) : empty(),

              //     $text(`${formatFixed(pos.roi, 2)}%`)
              //   )
              // }, config.competitionCumulative)
            }
          ],
        })({
          sortBy: sortByChangeTether(),
          scrollIndex: pageIndexTether()
        }),

        // position: fixed;
        // bottom: 0;
        // background: #252c34;
        // border-radius: 20px 20px 0 0;
        // padding: 22px;
        // z-index: 100;
        // width: 100%;
        // max-width: 780px;
        // $card(style({ position: 'fixed', bottom: 0, background: pallete.horizon, padding: '20px', borderRadius: '20px 20px 0 0', zIndex: 10, width: '100%', maxWidth: '780px' }))(
        //   $column(
        //     $infoLabel('Previous competition')
        //   )
        // )
      )

    ),

    {
      requestCompetitionLadder: map((params) => {
        const date = new Date()
        const started = unixTimestampNow() >= TOURNAMENT_START

        const from = started
          ? TOURNAMENT_START
          : Date.UTC(date.getFullYear(), date.getMonth() - 1, 1, 16) / 1000
        const to = from + TOURNAMENT_TIME_END

        const reqParams: IRequestCompetitionLadderApi = {
          ...params.sortBy,
          chain: params.chain,
          account: params.w3p?.address || null,
          referralCode: BLUEBERRY_REFFERAL_CODE,
          maxCollateral: MAX_COLLATERAL,
          metric: 'roi',
          from,
          to,
          offset: params.pageIndex * 20,
          pageSize: 20,
        }


        return reqParams
      }, combineObject({
        sortBy: sortBy, pageIndex,
        w3p: config.walletLink.wallet,
        chain: config.walletLink.network
      })
      ),
      // requestProfilePickList,
      routeChange
    }
  ]
})


