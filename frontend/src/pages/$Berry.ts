import { Behavior, combineObject, O, replayLatest } from "@aelea/core"
import { $element, $node, $text, attr, component, IBranch, nodeEvent, style } from "@aelea/dom"
import * as router from '@aelea/router'
import { Route } from "@aelea/router"
import { $column, $icon, $Popover, $row, $seperator, $TextField, layoutSheet } from "@aelea/ui-components"
import { pallete } from "@aelea/ui-components-theme"
import { USE_CHAIN, DEPLOYED_CONTRACT } from "@gambitdao/gbc-middleware"
import { isAddress } from "@gambitdao/gmx-middleware"

import { IWalletLink } from "@gambitdao/wallet-link"
import { awaitPromises, empty, filter, fromPromise, map, merge, multicast, skipRepeats, snapshot, startWith, switchLatest } from "@most/core"
import { GBC__factory } from "contracts"
import { $IntermediatePromise, $IntermediateTx } from "../common/$IntermediateDisplay"
import { $Table2 } from "../common/$Table2"
import { $AccountPreview } from "../components/$AccountProfile"
import { $ButtonPrimary, $ButtonSecondary } from "../components/form/$Button"
import { $accountRef, $card, $responsiveFlex, $txHashRef, $txnIconLink } from "../elements/$common"
import { $caretDblDown } from "../elements/$icons"
import { getBerryMetadata, getBerryPhotoFromMetadata } from "../logic/gbc"
import { queryToken } from "../logic/query"
import { IToken, ITransfer } from "../types"
import { timeSince } from "./common"

export function bnToHex(n: bigint) {
  return '0x' + n.toString(16)
}



interface IBerry {
  walletLink: IWalletLink
  parentRoute: Route
  // walletStore: cstate.BrowserStore<"metamask" | "walletConnect" | null, "walletStore">
}

export const $Berry = ({ walletLink, parentRoute }: IBerry) => component((
  [trasnferPopup, trasnferPopupTether]: Behavior<any, any>,
) => {

  const berry = parentRoute.create({ fragment: /\d+/ })

  const urlFragments = document.location.pathname.split('/')
  const berryId = urlFragments[urlFragments.length - 1]
  
  const tokenId = bnToHex(BigInt(berryId))
  const token = fromPromise(queryToken(tokenId))
  const metadata = fromPromise(getBerryMetadata(tokenId))
  
  const photo = map(getBerryPhotoFromMetadata, metadata)

  return [
    router.match(berry)(
      $column(layoutSheet.spacingBig)(
        $responsiveFlex(layoutSheet.spacingBig)(
          $row(style({ minWidth: '400px', height: '400px', overflow: 'hidden', borderRadius: '30px' }))(
            $IntermediatePromise({
              $done: map(res => {
                return $element('img')(style({ width: '400px', height: '400px', borderRadius: '30px' }))(attr({ src: res }))()
              }),
              query: photo
            })({})
          ),
          $node(),
          switchLatest(map(token => {
            return $column(layoutSheet.spacingBig)(
              $text(style({ fontWeight: 800, fontSize: '2.25em' }))(`GBC #${berryId}`),
              $row(layoutSheet.spacingSmall)(
                $text(style({  }))(`Owned by `),
                $accountRef(token.owner.id),
              ),

              switchLatest(map(account => {
                const isOwner = account && account.toLowerCase() === token.owner.id.toLowerCase()

                if (!isOwner) {
                  return empty()
                }

                return $row(
                  $Popover({
                    $$popContent: map(() => {
                      return $TrasnferOwnership(account, token, walletLink)({
                        // transfer: trasnferOwnershipTether()
                      })
                    }, trasnferPopup),
                  })(
                    $row(
                      $ButtonSecondary({
                        $content: $text('Transfer Ownership')
                      })({
                        click: trasnferPopupTether()
                      })
                    )
                  )({})
                )
              }, walletLink.account)),
              switchLatest(map(meta => {

                return $row(layoutSheet.spacing, style({ flexWrap: 'wrap' }))(...meta.attributes.map(trait => $card(style({ padding: '16px', minWidth: '140px' }), layoutSheet.spacingSmall)(
                  $text(style({ color: pallete.foreground, fontSize: '.75em' }))(trait.trait_type),
                  $text(trait.value),
                )))
              }, metadata)),

              
            )
          }, token)),
        ),

        $column(layoutSheet.spacing)(
          $text(style({ fontSize: '1.5em' }))('Transaction History'),
          $seperator,
          $Table2<ITransfer>({
            dataSource: map(md => {
              return md.transfers
            }, token),
            cellOp: style({ alignItems: 'center' }),
            columns: [
              {
                $head: $text('From'),
                $body: map(x => $accountRef(x.from.id))
              },
              {
                $head: $text('To'),
                $body: map(x => $accountRef(x.to.id))
              },
              {
                $head: $text('Txn'),
                $body: map(x => {
                  const time = Number(BigInt(x.timestamp))
                  const dateStr = new Date(Math.floor(time * 1000)).toLocaleDateString()

                  const timeAgo = timeSince(time)

                  return $row(layoutSheet.spacingSmall, style({ alignItems: 'center' }))(
                    $txnIconLink(x.transactionHash),
                    $column(
                      $text(style({ fontSize: '.65em' }))(`${timeAgo}`),
                      $text(`${dateStr}`),
                    ),
                  )
                })
              },
            ]
          })({})
        )
      )
    )
  ]
})


const $TrasnferOwnership = (address: string, token: IToken, walletLink: IWalletLink) => component((
  [submit, submitTether]: Behavior<any, any>,
  [clipboardInput, clipboardInputTether]: Behavior<IBranch, string>,
  [inputValueChange, inputValueChangeTether]: Behavior<string, string>,
) => {

  const contract = replayLatest(multicast(skipRepeats(awaitPromises(map(async w3p => {
    if (w3p === null || w3p?.network?.chainId !== USE_CHAIN) {
      return null
    }

    const contract = GBC__factory.connect(DEPLOYED_CONTRACT, w3p.getSigner())

    if (await contract.deployed()) {
      return contract
    }

    return null
  }, walletLink.provider)))))

  const value = startWith('', clipboardInput)
  const transferTo = merge(value, inputValueChange)

  const transfer = snapshot(async ({ contract, transferTo }, submit) => {
    if (contract === null) {
      throw new Error('no contract ')
    }

    const owner = (await contract.ownerOf(token.id)).toLowerCase()

    if (owner !== token.owner.id) {
      throw new Error(`Connected account does not own this token`)
    }

    return (await contract.transferFrom(address, transferTo, token.id)).wait()
  }, combineObject({ contract, transferTo }), submit)

  return [
    $column(layoutSheet.spacingBig)(
      $TextField({
        value,
        containerOp: style({ flexDirection: 'column' }),
        label: 'Address',
        hint: 'Copying an address will automatically fill this field',
        inputOp: O(
          clipboardInputTether(
            nodeEvent('focus'),
            map(async focusEvent => navigator.clipboard.readText().catch(() => '')),
            awaitPromises,
            filter(clipBoard => isAddress(clipBoard)),
          ),
          attr({ placeholder: 'Paste Address' }),
          style({ textAlign: 'center', minWidth: '250px' })
        ),
      })({
        change: inputValueChangeTether()
      }),

      $row(layoutSheet.spacing, style({ placeContent: 'center', alignItems: 'center' }))(

        $ButtonPrimary({
          $content: $text('Send To')
        })({
          click: submitTether()
        }),
        $icon({
          $content: $caretDblDown,
          width: '13px',
          svgOps: style({ transform: 'rotate(-90deg)' }),
          fill: pallete.foreground,
          viewBox: '0 0 32 32'
        }),
        switchLatest(map(ta => $AccountPreview({ address: ta })({}), transferTo))
      ),
      $IntermediateTx({
        query: transfer,
        $done: map(tx => $row(style({ color: pallete.positive }))($txHashRef(tx.transactionHash)))
      })({}),
    ),

    {  }
  ]
})