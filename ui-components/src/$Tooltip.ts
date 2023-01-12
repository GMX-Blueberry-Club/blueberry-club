import { Behavior } from "@aelea/core"
import { $Node, component, eventElementTarget, INode, NodeComposeFn, nodeEvent, style, styleInline } from '@aelea/dom'
import { $column, $row, observer } from "@aelea/ui-components"
import { pallete } from "@aelea/ui-components-theme"
import { constant, switchLatest, empty, map, skipRepeats, startWith, skip, zip } from "@most/core"




export interface TooltipConfig {
  $anchor: $Node
  $content: $Node
  $container?: NodeComposeFn<$Node>,
  $dropContainer?: NodeComposeFn<$Node>,

  offset?: number
}


const $defaultDropContainer = $column(style({
  background: pallete.background,
  border: pallete.middleground,
  boxShadow: 'rgb(0 0 0 / 44%) 0px 4px 20px 3px',
  padding: '8px',
  minWidth: '230px',
  borderRadius: '8px',
  fontWeight: 'normal',
}))


const $defaultTooltipAnchorContainer = $row(style({ position: 'relative', fontSize: '0.75em' }))

export const $Tooltip = ({
  $anchor,
  $content,
  offset = 5,
  $container = $defaultTooltipAnchorContainer,
  $dropContainer = $defaultDropContainer
}: TooltipConfig) => component((
  [hover, hoverTether]: Behavior<INode, boolean>,
  [targetIntersection, targetIntersectionTether]: Behavior<INode, IntersectionObserverEntry[]>,
  [contentIntersection, contentIntersectionTether]: Behavior<INode, IntersectionObserverEntry[]>,
) => {


  const isTouchDevice = 'ontouchstart' in window

  return [
    $container(
      hoverTether(
        nodeEvent(isTouchDevice ? 'pointerenter' : 'pointerenter'),
        map(enterEvent => {

          // prevent selection highlighting
          if (isTouchDevice) {
            enterEvent.preventDefault()
          }


          const target = enterEvent.currentTarget
          if (!(target instanceof HTMLElement)) {
            throw new Error('invalid Target element')
          }


          const pointerLeave = isTouchDevice
            ? skip(1, eventElementTarget('pointerdown', window))
            : eventElementTarget('pointerleave', target)
          return startWith(true, constant(false, pointerLeave))
          // return startWith(true, never())
        }),
        switchLatest,
        skipRepeats,
      ),
      targetIntersectionTether(
        observer.intersection(),
      )
    )(
      style({ cursor: 'help' })(
        $anchor
      ),
      switchLatest(map(show => {
        if (!show) {
          return empty()
        }

        return $row(
          contentIntersectionTether(
            observer.intersection()
          ),
          style({
            zIndex: 5160,
            position: 'absolute',
            visibility: 'hidden',
            padding: '8px',
          }),
          styleInline(
            zip(([contentRect], [targetRect]) => {
              const { bottom, top, left, right, height } = targetRect.intersectionRect
              const { width } = contentRect.boundingClientRect
              const rootBounds = contentRect.rootBounds!

              const bottomSpcace = rootBounds.height - bottom
              const goDown = bottomSpcace > bottom

              const targetSlice = targetRect.intersectionRect.width / 2

              const leftSpace = left + targetSlice
              const rightSpace = rootBounds.width - leftSpace

              const isLeft = leftSpace < rightSpace
              const boundingOffset = isLeft
                ? leftSpace - width / 2 - targetSlice - offset
                : rightSpace - width / 2 - targetSlice
              
              const leftPx = boundingOffset < 0 ? isLeft ? Math.abs(boundingOffset) : boundingOffset : targetSlice

              return {
                [goDown ? 'top' : 'bottom']: `calc(100% + ${0}px)`,
                left: leftPx + 'px',
                visibility: 'visible',
                transform: `translate(-50%, 0)`,
              }
            }, contentIntersection, targetIntersection)
          ),
        )(
          $dropContainer(
            $content
          )
        )
      }, hover))
    ),
    {
      hover
    }
  ]

})
