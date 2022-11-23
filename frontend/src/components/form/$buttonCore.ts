import { constant, empty, filter, map, merge, mergeArray, never } from "@most/core"
import { Behavior, O, Op } from '@aelea/core'
import { $Node, $element, component, nodeEvent, INode, styleBehavior, IBranch, attrBehavior, StyleCSS, NodeComposeFn } from '@aelea/dom'
import { pallete } from '@aelea/ui-components-theme'
import { Control, designSheet } from "@aelea/ui-components"


export const interactionOp = O(
  (src: $Node) => merge(nodeEvent('focus', src), nodeEvent('pointerover', src)),
  constant(true)
)

export const dismissOp = O(
  (src: $Node) => merge(nodeEvent('blur', src), nodeEvent('pointerout', src)),
  filter(x => document.activeElement !== x.target,), // focused elements cannot be dismissed
  constant(false)
)

export interface IButton extends Control {
  $container?: NodeComposeFn<$Node>,
  $content: $Node,
  buttonStyle?: StyleCSS
}

export const $Button = (config: IButton) => component((
  [focusStyle, interactionTether]: Behavior<IBranch, true>,
  [dismissstyle, dismissTether]: Behavior<IBranch, false>,
  [click, clickTether]: Behavior<INode, PointerEvent>
) => {

  const disabled = config.disabled || empty()

  const $button = (config.$container || $element('button'))(
    designSheet.btn,
    clickTether(
      nodeEvent('pointerup')
    ),
    styleBehavior(
      map(disabled => disabled ? { opacity: .4, pointerEvents: 'none' } : null, disabled)
    ),


    attrBehavior(
      map(d => {
        return { disabled: d ? 'true' : null }
      }, disabled)
    ),

    styleBehavior(
      map(
        active => active ? { borderColor: pallete.primary } : null,
        mergeArray([focusStyle, dismissstyle])
      )
    ),

    interactionTether(interactionOp),
    dismissTether(dismissOp),
  )

  return [
    $button(config.$content),

    {
      click
    }
  ]
})
