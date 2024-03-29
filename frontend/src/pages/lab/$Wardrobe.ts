import { Behavior, combineArray, combineObject, Op } from "@aelea/core"
import { $node, $Node, $text, attr, attrBehavior, component, INode, nodeEvent, style, stylePseudo } from "@aelea/dom"
import { Route } from "@aelea/router"
import { $column, $icon, $row, layoutSheet, screenUtils } from "@aelea/ui-components"

import { IWalletLink, IWalletName } from "@gambitdao/wallet-link"
import { awaitPromises, constant, empty, filter, map, merge, mergeArray, multicast, now, skipRepeatsWith, snapshot, startWith, switchLatest, tap } from "@most/core"
import { $buttonAnchor, $ButtonPrimary, $ButtonSecondary } from "../../components/form/$Button"
import { $defaultSelectContainer, $Dropdown } from "../../components/form/$Dropdown"
import { IBerryDisplayTupleMap, getLabItemTupleIndex, saleDescriptionList, LabItemSale, IBerryLabItems, LAB_CHAIN, IToken, GBC_ADDRESS, getLatestSaleRule, tokenIdAttributeTuple, blueberrySubgraph } from "@gambitdao/gbc-middleware"
import { $labItem, getBerryFromToken, getTokenSlots } from "../../logic/common"
import { $berryTileId } from "../../components/$common"
import { fadeIn } from "../../transitions/enter"
import { colorAlpha, pallete, theme } from "@aelea/ui-components-theme"
import { $berry, $defaultBerry } from "../../components/$DisplayBerry"
import { $caretDown } from "../../elements/$icons"
import { $alert, $arrowsFlip, $IntermediateTx, $xCross } from "@gambitdao/ui-components"
import { ContractReceipt, ContractTransaction } from "@ethersproject/contracts"
import { Stream } from "@most/types"
import { $iconCircular, $responsiveFlex } from "../../elements/$common"
import { $seperator2 } from "../common"
import { filterNull, switchMap, unixTimestampNow } from "@gambitdao/gmx-middleware"
import { $IntermediateConnectButton } from "../../components/$ConnectAccount"
import { Closet, GBCLab } from "@gambitdao/gbc-contracts"
import { connectLab } from "../../logic/contract/gbc"
import { CHAIN } from "@gambitdao/const"


interface IBerryComp {
  chainList: CHAIN[],

  walletLink: IWalletLink
  parentRoute: Route

  initialBerry?: IToken
}


type ItemSlotState = {
  id: number
  isRemove: boolean
}

interface ExchangeState {
  updateItemState: ItemSlotState | null
  updateBackgroundState: ItemSlotState | null
  updateBadgeState: ItemSlotState | null
  closet: Closet
  lab: GBCLab
  selectedBerry: IToken | null
  selectedBerryItems: IBerryLabItems

  account: string
}

type Slot = 0 | 6 | null

export const $Wardrobe = (config: IBerryComp) => component((
  [changeRoute, changeRouteTether]: Behavior<any, string>,
  [changeBerry, changeBerryTether]: Behavior<IToken, IToken>,
  [selectedSlot, selectedSlotTether]: Behavior<Slot, Slot>,
  [clickSave, clickSaveTether]: Behavior<PointerEvent, Promise<ContractTransaction>>,

  [changeItemState, changeItemStateTether]: Behavior<any, ItemSlotState | null>,
  [changeBackgroundState, changeBackgroundStateTether]: Behavior<any, ItemSlotState | null>,
  [changeBadgeState, changeBadgeStateTether]: Behavior<any, ItemSlotState | null>,

  [setApproval, setApprovalTether]: Behavior<any, Promise<ContractTransaction>>,

  [hoverDownloadBtn, hoverDownloadBtnTether]: Behavior<INode, string>,
  [setMainBerry, setMainBerryTether]: Behavior<PointerEvent, Promise<ContractTransaction>>,


  [changeNetwork, changeNetworkTether]: Behavior<any, CHAIN>,
  [walletChange, walletChangeTether]: Behavior<IWalletName, IWalletName>,
) => {

  const connect = connectLab(config.walletLink.provider)
  // const gbc = connectGbc(walletLink)
  // const closet = connectManager(config.walletLink)
  const account = filterNull(map(w3p => w3p ? w3p.address : null, config.walletLink.wallet))

  const owner = multicast(awaitPromises(switchLatest(map(w3p => {
    if (w3p === null) {
      return null
    }
    return blueberrySubgraph.owner(now({ id: w3p.address }))
  }, config.walletLink.wallet))))

  const tokenList = map(xz => xz ? xz.ownedTokens : [], owner)

  const savedItemsTxSucceed: Stream<ContractReceipt> = filter(res => res !== null, awaitPromises(map(async txc => {
    const res = await txc.catch(() => null)

    if (res === null) {
      return null
    }

    return res.wait()
  }, clickSave)))

  const selectedBerry = mergeArray([constant(null, owner), changeBerry])

  const ownedItemList: Stream<{
    amount: number;
    id: number;
  }[]> = switchMap(w3p => {
    if (w3p === null) {
      return empty()
    }

    const list = mergeArray([
      connect.accountListBalance(w3p.address, saleDescriptionList.map(x => x.id)),
      switchLatest(map(() => connect.accountListBalance(w3p.address, saleDescriptionList.map(x => x.id)), savedItemsTxSucceed))
    ])
    return list
  }, config.walletLink.wallet)

  const isClosetApproved = awaitPromises(combineArray(async (c) => {
    return c.isApprovedForAll(c.signer.getAddress(), GBC_ADDRESS.CLOSET)
  }, connect.lab.contract))

  const isClosetApprovedState = mergeArray([isClosetApproved, switchLatest(awaitPromises(map(async tx => {
    await (await tx).wait()
    return isClosetApproved
  }, setApproval)))])

  const resetItemOnSave = constant(null, savedItemsTxSucceed)

  const itemChangeState = startWith(null, merge(resetItemOnSave, changeItemState))
  const backgroundChangeState = startWith(null, merge(resetItemOnSave, changeBackgroundState))
  const badgeChangeState = startWith(null, merge(resetItemOnSave, changeBadgeState))

  const berryItemState = mergeArray([snapshot((berry) => berry, selectedBerry, savedItemsTxSucceed), changeBerry])


  const selectedBerryItems = multicast(startWith(null, awaitPromises(snapshot(async (closet, token) => {
    if (token === null) return null

    const newLocal = await getTokenSlots(token.id, closet)
    return newLocal
  }, connect.closet.contract, berryItemState))))


  const exchangeState: Stream<ExchangeState> = multicast(combineObject({
    updateItemState: itemChangeState,
    updateBackgroundState: backgroundChangeState,
    updateBadgeState: badgeChangeState,
    selectedBerry,
    closet: connect.closet.contract,
    selectedBerryItems,
    lab: connect.lab.contract,
    account
  }))



  const previewSize = screenUtils.isDesktopScreen ? 475 : 350

  const mustBerry = filter(<T extends NonNullable<ExchangeState['selectedBerry']>>(b: T | null): b is T => b !== null, selectedBerry)

  const primaryActionLabel = combineArray((updateItemState, updateBackgroundState, token) => {

    const berry = getBerryFromToken(token)

    const swapItem = !updateItemState?.isRemove && berry.custom && updateItemState?.id
    const swapBg = !updateBackgroundState?.isRemove && berry.background && updateBackgroundState?.id

    const isRemoving = updateBackgroundState?.isRemove || updateItemState?.isRemove
    const isSwapping = swapBg || swapItem

    if (isSwapping && isRemoving) {
      return 'Swap & Remove'
    }

    const label = isSwapping
      ? 'Swap' : updateBackgroundState?.isRemove || updateItemState?.isRemove
        ? 'Remove' : 'Save'

    return label
  }, itemChangeState, backgroundChangeState, mustBerry)



  const berryItemSelection = map(b => b?.custom || null, selectedBerryItems)
  const berryBackgroundSelection = map(b => b?.background || null, selectedBerryItems)
  const berryBadgeSelection = map(b => b?.badge || null, selectedBerryItems)
  const selectedSlotState = startWith(null, selectedSlot)


  return [
    $responsiveFlex(style({ placeContent: 'space-between' }), style(screenUtils.isDesktopScreen ? { gap: '125px' } : { gap: '105px' }))(

      $column(layoutSheet.spacing, style({ flexDirection: screenUtils.isMobileScreen ? 'column-reverse' : 'column' }))(
        $row(style({ alignItems: 'center', alignSelf: 'center', borderRadius: '30px', backgroundColor: pallete.horizon, position: 'relative', placeContent: 'center', minWidth: previewSize + 'px', width: previewSize + 'px', height: previewSize + 'px' }))(

          $node(style({ display: 'flex', flexDirection: 'column', position: 'absolute', gap: '16px', alignItems: 'center', placeContent: 'center', ...screenUtils.isDesktopScreen ? { width: '0px', right: 0, top: 0, bottom: 0 } : { height: 0, bottom: '-15px', flexDirection: 'row' } }))(
            switchLatest(combineArray(((a, b, c) => {
              return $ItemSlot({
                slot: null,
                slotLabel: 'Item',
                gbcItemId: b,
                change: a,
                selectedSlot: c
              })({
                remove: changeItemStateTether(),
                select: selectedSlotTether()
              })
            }), itemChangeState, berryItemSelection, selectedSlotState)),
            switchLatest(combineArray(((a, b, c) => {
              return $ItemSlot({
                slot: 0,
                slotLabel: 'Background',
                gbcItemId: b,
                change: a,
                selectedSlot: c
              })({
                remove: changeBackgroundStateTether(),
                select: selectedSlotTether()
              })
            }), backgroundChangeState, berryBackgroundSelection, selectedSlotState)),
            switchLatest(combineArray(((a, b, c) => {
              return $ItemSlot({
                slot: 6,
                slotLabel: 'Badge',
                gbcItemId: b,
                change: a,
                selectedSlot: c
              })({
                remove: changeBadgeStateTether(),
                select: selectedSlotTether()
              })
            }), badgeChangeState, berryBadgeSelection, selectedSlotState)),
            // style({ opacity: '0.2', pointerEvents: 'none' }, switchLatest(combineArray(((a, b, c) => $ItemSlot(7, c, a, b)({ remove: changeDecoStateTether(), select: selectedSlotTether() })), backgroundChangeState, berryBgSel, selectedSlotState)),)
          ),

          switchLatest(map(({ selectedBerry, updateItemState, updateBackgroundState, updateBadgeState, selectedBerryItems }) => {

            let $berry2: $Node | null = null

            const labCustom = !updateItemState?.isRemove && (updateItemState?.id || selectedBerryItems?.custom)
            const labBackground = !updateBackgroundState?.isRemove && (updateBackgroundState?.id || selectedBerryItems?.background)
            const badge = !updateBadgeState?.isRemove && (updateBadgeState?.id || selectedBerryItems?.badge)

            if (selectedBerry) {
              const [background, clothes, body, expression, faceAccessory, hat] = tokenIdAttributeTuple[selectedBerry.id - 1]

              const displaytuple: Partial<IBerryDisplayTupleMap> = [labBackground || background, clothes, body, expression, faceAccessory, hat]

              if (badge) { 
                displaytuple[6] = badge
              }

              if (labCustom) {
                displaytuple.splice(getLabItemTupleIndex(labCustom), 1, labCustom)
              }


              $berry2 = attr({ id: 'BERRY' })($berry(displaytuple, $defaultBerry(style({ borderRadius: '30px' }))))
            }

            return $berry2
              ? $berry2
              : $row(style({}))()

          }, exchangeState)),
        ),

        $row(layoutSheet.spacing, style({ placeContent: 'center' }))(
          switchLatest(map(tokenList => {
            return $Dropdown({
              $selection: $ButtonSecondary({
                disabled: now(tokenList.length === 0),
                $content: $row(style({ alignItems: 'center' }))(
                  $text(map((s: IToken | null) => {
                    return s ? `GBC #` + s.id : 'Pick GBC'
                  }, mergeArray([now(null), selectedBerry]))),
                  $icon({ $content: $caretDown, width: '16px', fill: pallete.message, svgOps: style({ marginTop: '3px', marginLeft: '6px' }), viewBox: '0 0 32 32' }),
                ),
              })({}),
              $option: $row,
              value: {
                $container: $defaultSelectContainer(layoutSheet.spacingSmall, style({ display: 'grid', overflowX: 'hidden', gridTemplateColumns: 'repeat(3, 1fr)', padding: '15px', flexWrap: 'wrap', width: '310px', maxHeight: '400px', overflow: 'auto', flexDirection: 'row' })),
                value: now(config.initialBerry || null),
                $$option: map(token => {

                  if (!token) {
                    throw new Error(`No berry id:${token} exists`)
                  }

                  return style({ cursor: 'pointer' }, $berryTileId(token))
                }),
                list: tokenList
              }
            })({
              select: changeBerryTether()
            })
          }, tokenList)),

          switchLatest(awaitPromises(combineArray(async (contract, account, berry) => {
            const mainId = account ? (await contract.getDataOf(account).catch(() => null))?.tokenId.toNumber() : null
            const disabled = now(berry === null || berry?.id === mainId)

            return $ButtonSecondary({ $content: $text(`Set PFP`), disabled })({
              click: setMainBerryTether(map(async () => {
                return (await contract.chooseMain(berry!.id))
              }))
            })
          }, connect.profile.contract, account, selectedBerry))),
        ),
      ),


      $column(layoutSheet.spacingBig, style({ flex: 1, }))(

        switchLatest(combineArray((ownedItems, selected, account) => {
          const storeItemList: LabItemSale[] = selected === 0 || selected === 6
            ? saleDescriptionList.filter(item => getLabItemTupleIndex(item.id) === selected)
            : saleDescriptionList.filter(item => {
              const attrTupleId = getLabItemTupleIndex(item.id)
              return attrTupleId > 0 && attrTupleId < 6
            })        

          return $row(layoutSheet.spacing, style({ flexWrap: 'wrap', placeContent: 'center' }))(
            ...storeItemList.map(item => {
              const id = item.id

              const unixTime = unixTimestampNow()
              const activeMint = getLatestSaleRule(item)


              const upcommingSaleDate = activeMint.start
              const itemBalance = ownedItems.find(ownedItem => ownedItem.id === id)

              const isSaleUpcomming = upcommingSaleDate > unixTime

              const wearBehavior = getLabItemTupleIndex(id) === 0 ? changeBackgroundStateTether : getLabItemTupleIndex(id) === 6 ? changeBadgeStateTether  : changeItemStateTether
              const selectBehavior: Op<any, any> = wearBehavior(nodeEvent('click'), constant({ isRemove: false, id }))


              const itemBalanceChange = map(slot => {
                return slot?.id === id ? slot.isRemove ? 1 : -1 : 0
              }, mergeArray([itemChangeState, backgroundChangeState]))

              return $row(style({ position: 'relative' }))(
                $row(style({ cursor: 'pointer', overflow: 'hidden', borderRadius: '8px', backgroundColor: colorAlpha(pallete.message, theme.name === 'light' ? .12 : .92) }))(
                  fadeIn(
                    style({ filter: itemBalance && itemBalance?.amount > 0n ? '' : 'grayscale(1)' }, selectBehavior($labItem({ id })))
                  )
                ),
                itemBalance?.amount && account
                  ? $text(style({ position: 'absolute', top: '1px', right: '4px', fontSize: '.75em', fontWeight: 'bold', color: pallete.background }))(
                    awaitPromises(map(async (delta) => {
                      const count = itemBalance.amount + delta
                      // const count = ((await lab.balanceOf(account, id)).toNumber() + delta)
                      return `${Math.max(0, count)}x`
                    }, itemBalanceChange))
                  )
                  : style({
                    placeContent: 'center', alignItems: 'center',
                    position: 'absolute',
                    top: '-15px',
                    width: '50px',
                    height: '50px',
                    right: '-15px',
                    padding: '4px'
                  })($ButtonSecondary({
                    $content: $text('Buy'),
                  })({
                    click: changeRouteTether(
                      constant(`/p/item/${id}`),
                      tap(x => history.pushState(null, '', x)),
                    )
                  })),
              )
            })
          )
        }, ownedItemList, selectedSlotState, account)),


        $row(style({ placeContent: 'center' }))(
          switchLatest(map(list => {
            return list.length === 0 ? style({ alignSelf: 'center' }, $alert($text(`Connect account with owned GBC's`))) : empty()
          }, tokenList))
        ),

        $seperator2,

        $column(layoutSheet.spacing, style({ placeContent: screenUtils.isDesktopScreen ? 'flex-start' : 'center', flexWrap: 'wrap-reverse' }))(
          $row(layoutSheet.spacing, style({ flex: 1, width: '100%' }))(

            $row(style({ flex: 1 }))(),


            switchLatest(combineArray(exchState => {
              const isDisabled = exchState.updateBackgroundState === null && exchState.updateItemState === null && exchState.selectedBerry

              return $buttonAnchor(
                hoverDownloadBtnTether(
                  nodeEvent('pointerenter'),
                  map(() => `GBC-${exchState.selectedBerry?.id}.png`),
                  skipRepeatsWith((prev, next) => prev === next)
                ),
                style(isDisabled ? {} : { opacity: '.4', pointerEvents: 'none' }),
                attrBehavior(awaitPromises(map(async name => {
                  const svg = document.querySelector('#BERRY')!.querySelector('svg')! as SVGElement
                  const href = await getGbcDownloadableUrl(svg)
                  console.log(href)
                  return { href, download: name }
                }, hoverDownloadBtn))),
              )($text('Download'))
            }, exchangeState)),



            $IntermediateConnectButton({
              chainList: config.chainList,
              $$display: map((w3p) => {
                return switchLatest(map(isApproved => {

                  if (isApproved === true) {
                    return $ButtonPrimary({
                      $content: $text(startWith('Save', primaryActionLabel as Stream<string>)),
                      disabled: combineArray(({ selectedBerry, updateBackgroundState, updateItemState, selectedBerryItems, updateBadgeState }) => {
                        if (selectedBerryItems === null || selectedBerry === null || updateItemState === null && updateBackgroundState === null && updateBadgeState === null) {
                          return true
                        }

                        if (!updateItemState?.isRemove && updateItemState?.id === selectedBerryItems.custom || !updateBackgroundState?.isRemove && updateBackgroundState?.id === selectedBerryItems.background && !updateBadgeState?.isRemove && updateBadgeState?.id === selectedBerryItems.badge) {
                          return true
                        }

                        return false
                      }, exchangeState)
                    })({
                      click: clickSaveTether(
                        snapshot(async ({ selectedBerry, selectedBerryItems, updateBackgroundState, updateItemState, updateBadgeState, closet: contract, account }) => {

                          if (!selectedBerry || !account) {
                            throw 'no berry selected'
                          }

                          const addList: number[] = []
                          const removeList: number[] = []

                          if (updateItemState) {

                            if (updateItemState.isRemove) {
                              removeList.push(selectedBerryItems.custom)
                            } else {
                              addList.push(updateItemState.id)

                              if (selectedBerryItems.custom) {
                                removeList.push(selectedBerryItems.custom)
                              }
                            }

                          }

                          if (updateBadgeState) {
                            if (updateBadgeState.isRemove) {
                              removeList.push(selectedBerryItems.badge)
                            } else {
                              addList.push(updateBadgeState.id)

                              if (selectedBerryItems.badge) {
                                removeList.push(selectedBerryItems.badge)
                              }
                            }
                          }

                          if (updateBackgroundState) {
                            if (updateBackgroundState.isRemove) {
                              removeList.push(selectedBerryItems.background)
                            } else {
                              addList.push(updateBackgroundState.id)

                              if (selectedBerryItems.background || updateBackgroundState.isRemove) {
                                removeList.push(selectedBerryItems.background)
                              }
                            }
                          }

                          // try {
                          //   const tx = (await contract.callStatic.set(selectedBerry.id, addList, removeList, account))
                          // } catch (err) {
                          //   // @ts-ignore
                          //   const revertData = err.data
                          //   const decodedError = contract.interface.getError(revertData)
                          //   console.log(`Transaction failed: ${decodedError.name}`)
                          // }

                          const tx = (await contract.set(selectedBerry.id, addList, removeList, account))

                          return tx
                        }, exchangeState),
                        multicast
                      )
                    })
                  }

                  if (isApproved || isApproved === null) {
                    return empty()
                  }

                  return $ButtonPrimary({
                    $content: $text('Approve Contract'),
                  })({
                    click: setApprovalTether(
                      snapshot(contract => contract.setApprovalForAll(GBC_ADDRESS.CLOSET, true), connect.lab.contract),
                      multicast
                    )
                  })
                }, isClosetApprovedState))
              }),
              walletLink: config.walletLink,
            })({
              changeNetwork: changeNetworkTether(),
              walletChange: walletChangeTether()
            }),

          ),

          $row(layoutSheet.spacing, style({ placeContent: 'flex-end' }))(
            $IntermediateTx({
              chain: LAB_CHAIN,
              query: mergeArray([clickSave, setMainBerry, setApproval])
            })({}),
          ),
        )

      ),

    ),

    {
      changeRoute, changeNetwork, walletChange
    }
  ]
})


interface ItemSlotComp {
  slot: Slot
  selectedSlot: Slot
  change: ItemSlotState | null
  gbcItemId: number | null
  slotLabel: string
}

const $ItemSlot = ({ selectedSlot, change, gbcItemId, slot, slotLabel }: ItemSlotComp) => component((
  [remove, removeTether]: Behavior<INode, ItemSlotState | null>,
  [select, selectTether]: Behavior<any, any>
) => {

  const isGbcItemRemove = change?.isRemove === true
  const changeItemId = change?.id

  const isSwap = gbcItemId && changeItemId
  const item = changeItemId || gbcItemId

  const state = change === null && gbcItemId
    ? { isRemove: true, id: gbcItemId }
    : null


  const itemSize = 80
  const itemSizePx = itemSize + 'px'

  const $itemWrapper = $row(style({ overflow: 'hidden', placeContent: 'center', width: '65px' }))
  const $tradeBox = $row(
    style({
      height: itemSizePx, boxSizing: 'content-box', minWidth: itemSizePx, borderRadius: '12.75px', gap: '1px', overflow: 'hidden', boxShadow: '-1px 2px 7px 2px #0000002e',
      position: 'relative', backgroundColor: pallete.background, border: `2px solid`, cursor: 'pointer'
    }),
    stylePseudo(':hover', { borderColor: pallete.primary }),
    style(selectedSlot === slot ? { borderColor: pallete.middleground, pointerEvents: 'none' } : { borderColor: pallete.horizon })
  )

  const canRemove = item && change?.isRemove !== true

  return [
    $column(style({ position: 'relative' }))(
      canRemove
        ? removeTether(nodeEvent('click'), constant(state))(
          style({ right: '-5px', boxShadow: '1px 1px 6px #00000063', padding: '4px', top: '-5px', position: 'absolute' })($iconCircular($xCross))
        )
        : empty(),
      $tradeBox(selectTether(nodeEvent('click'), constant(slot)))(
        gbcItemId && isSwap && !isGbcItemRemove ? $itemWrapper($labItem({ id: gbcItemId, showFace: false })) : empty(),
        gbcItemId && isSwap && !isGbcItemRemove ? style({ left: '50%', top: '50%', marginLeft: '-12px', marginTop: '-12px', pointerEvents: 'none', position: 'absolute' })($iconCircular($arrowsFlip, pallete.horizon)) : empty(),
        $itemWrapper(style({ width: isSwap && canRemove ? '65px' : itemSizePx }))(
          item ? style({ borderRadius: 0, filter: change?.isRemove ? 'saturate(0) brightness(0.2)' : '' }, $labItem({ id: item })) : $row(style({ flex: 1, alignItems: 'center', placeContent: 'center', color: pallete.foreground, fontSize: '.65em' }))($text(slotLabel))
        )
      )
    ),

    { remove, select }
  ]
})

function triggerDownload(imgURI: string) {
  const evt = new MouseEvent('click', {
    view: window,
    bubbles: false,
    cancelable: true
  })

  const a = document.createElement('a')
  a.setAttribute('download', 'MY_COOL_IMAGE.png')
  a.setAttribute('href', imgURI)
  a.setAttribute('target', '_blank')

  a.dispatchEvent(evt)
}

function getGbcDownloadableUrl(svg: SVGElement): Promise<string> {
  const data = (new XMLSerializer()).serializeToString(svg)
  const blob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' })

  const DOMURL = window.URL || window.webkitURL || window

  const url = DOMURL.createObjectURL(blob)

  svg.setAttribute('width', svg.clientWidth + 'px')
  svg.setAttribute('height', svg.clientWidth + 'px')


  const image = new Image()

  image.src = url
  image.crossOrigin = 'anonymous'

  image.width = 1500
  image.height = 1500
  image.style.display = 'none'

  return new Promise(resolve => {
    document.body.appendChild(image)
    console.log(image)

    image.onload = () => {
      image.onload = null

      const canvas = document.createElement('canvas')

      canvas.width = 1500
      canvas.height = 1500

      const context = canvas.getContext('2d')
      context?.drawImage(image, 0, 0, 1500, 1500)

      canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream')

      canvas.toBlob(blob => {
        if (!blob) throw new Error('Unable to create an image')

        const downloadableLink = URL.createObjectURL(blob)
        resolve(downloadableLink)
      })

      image.remove()
    }
  })
}

