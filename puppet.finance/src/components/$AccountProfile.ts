import { $Node, $node, $text, NodeComposeFn, style } from "@aelea/dom"
import { $column, $row, layoutSheet } from "@aelea/ui-components"
import { pallete } from "@aelea/ui-components-theme"
import { IEnsRegistration } from "@gambitdao/gmx-middleware"
import { IWalletLink } from "@gambitdao/wallet-link"
import { $jazzicon } from "../common/$avatar"
import { blueberrySubgraph, IOwner } from "@gambitdao/gbc-middleware"
import { $berryByToken } from "../logic/common"
import { awaitPromises, empty, map, now, switchLatest } from "@most/core"
import { Account, Address } from "viem"


export interface IAccountPreview {
  address: Address
  labelSize?: string
  showAddress?: boolean
  $container?: NodeComposeFn<$Node>
}

export interface IProfilePreview {
  profile: IOwner
  $container?: NodeComposeFn<$Node>
  labelSize?: string
  showAddress?: boolean
}

export interface IAccountClaim extends IAccountPreview {
}


export const $AccountLabel = (address: string, fontSize = '1em') => {
  return $column(style({ fontSize }))(
    $text(style({ fontSize: '.75em' }))(address.slice(0, 6)),
    $text(style({ fontSize: '1em' }))(address.slice(address.length - 4, address.length))
  )
}

export const $ProfileLabel = (ens: IEnsRegistration) => {
  const hasTwitter = ens.domain.resolver?.texts?.find(t => t === 'com.twitter')

  if (hasTwitter) {
    $row(
      $text(style({ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }))(ens.labelName),
      // $text(style({ fontSize: '1em' }))(address.slice(address.length - 4, address.length))
    )
  }

  return $text(style({ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }))(ens.labelName)
}




export const $discoverIdentityDisplay = (config: IAccountPreview) => {
  const { $container, address, showAddress = true } = config

  const profileEv = awaitPromises(blueberrySubgraph.owner(now({ id: address.toLowerCase() })))

  return switchLatest(map(profile => {
    return profile
      ? $profilePreview({ ...config, profile })
      : $accountPreview(config)
  }, profileEv))
}


export const $accountPreview = ({
  address, showAddress = true, $container, labelSize
}: IAccountPreview) => {
  return $row(layoutSheet.spacingSmall, style({ alignItems: 'center', pointerEvents: 'none', textDecoration: 'none' }))(
    $jazzicon({
      address,
      $container
    }),
    showAddress ? $AccountLabel(address, labelSize) : empty(),
  )
}


export const $profilePreview = ({
  $container, profile, showAddress = true, labelSize = '16px'
}: IProfilePreview) => {
  return $row(layoutSheet.row, layoutSheet.spacingSmall, style({ alignItems: 'center', pointerEvents: 'none', textDecoration: 'none' }))(
    profile.profile
      ? style({ borderRadius: '50%' }, $berryByToken(profile.profile, $container))
      : $jazzicon({
        address: profile.id,
        $container
      }),
    showAddress
      ? profile?.ens?.labelName
        ? $ProfileLabel(profile.ens!)
        : $AccountLabel(profile.id, labelSize)
      : empty()
  )
}


export const $disconnectedWalletDisplay = (avatarSize = 38) => {
  const sizePx = avatarSize + 'px'
  const $wrapper = $node(style({ width: sizePx, height: sizePx, minWidth: sizePx, minHeight: sizePx, borderRadius: '50%' }))

  return $row(layoutSheet.row, layoutSheet.spacingSmall, style({ alignItems: 'center', textDecoration: 'none' }))(
    $wrapper(style({ display: 'flex', border: `1px solid ${pallete.foreground}`, placeContent: 'center', alignItems: 'center' }))(
      $text(style({ fontWeight: 800, color: pallete.foreground }))('?')
    ),
    $column(style({ whiteSpace: 'nowrap', fontSize: '16px' }))(
      $text(style({ fontSize: '.75em' }))('0x----'),
      $text(style({ fontSize: '1em' }))('----')
    )
  )
}




