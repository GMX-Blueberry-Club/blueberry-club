import { $node, $Node, component, nodeEvent, INode, style, styleBehavior, NodeComposeFn } from '@aelea/dom'
import { O, Behavior } from '@aelea/core'
import { pallete } from "@aelea/ui-components-theme"
import { constant, empty, map, merge, mergeArray, multicast, switchLatest, until } from "@most/core"
import { Stream } from "@most/types"
import { colorAlpha } from "@aelea/ui-components-theme"
import { combineArray } from '@aelea/core'
import { observer } from '@aelea/ui-components'


interface IPocus {
  
  $target: $Node
  $popContent: Stream<$Node>

  $container?: NodeComposeFn<$Node>
  offset?: number
  padding?: number
  dismiss?: Stream<any>

  // overlayBackgroundColor?: string
  // overlayAlpha?: string
}

export const $Popover = ({ $popContent, offset = 30, padding = 76, dismiss = empty(), $container = $node, $target }: IPocus) => component((
  [overlayClick, overlayClickTether]: Behavior<INode, any>,
  [targetIntersection, targetIntersectionTether]: Behavior<INode, IntersectionObserverEntry[]>,
  [popoverContentDimension, popoverContentDimensionTether]: Behavior<INode, ResizeObserverEntry[]>,
  [popoverContentIntersection, popoverContentIntersectionTether]: Behavior<INode, IntersectionObserverEntry[]>,
) => {


  const $$popContentMulticast = multicast($popContent)

  const $overlay = $node(
    style({
      position: 'absolute', zIndex: 99999,
      top: 0, left: 0, right: 0, bottom: 0
    }),
    overlayClickTether(
      nodeEvent('click')
    ),
    styleBehavior(
      combineArray(([contentResize], [_intersectionContentRect], [IntersectiontargetRect]) => {
        const { y, x, bottom } = IntersectiontargetRect.intersectionRect

        const width = Math.max(contentResize.contentRect.width, IntersectiontargetRect.intersectionRect.width) + (padding * 2) + offset
        const targetHeight = IntersectiontargetRect.intersectionRect.height
        const contentHeight = contentResize.contentRect.height
        const height = contentHeight + targetHeight + offset

        const left = x + (IntersectiontargetRect.intersectionRect.width / 2) + 'px'

        const bottomSpace =  window.innerHeight - bottom
        const popDown = bottomSpace > bottom
        const top = (popDown ? y + (height / 2) : y - ((height - padding) / 2) ) + 'px'


        return {
          backgroundImage: `radial-gradient(${width}px ${height + padding * 2}px at top ${top} left ${left}, ${pallete.background} ${width / 2}px, ${colorAlpha(pallete.horizon, .45)})`,
          // backdropFilter: 'blur(2px)'
        }
      }, popoverContentDimension, popoverContentIntersection, targetIntersection)
    )
  )

  const contentOps = O(
    popoverContentIntersectionTether(
      observer.intersection(),
    ),
    popoverContentDimensionTether(
      observer.resize({ })
    ),
    styleBehavior(
      map(([rect]) => {
        const { y, x, width, bottom } = rect.intersectionRect

        const bottomSpcace =  window.innerHeight - bottom
        const goDown = bottomSpcace > bottom

        const top = (goDown ? bottom + offset : y - offset) + 'px'
        const left = x + (width / 2) + 'px'

        return {
          top, left,
          visibility: 'visible',
          transform: `translate(-50%, ${goDown ? '0': '-100%'})`
        }
      }, targetIntersection)
    ),
    style({ zIndex: 100000, position: 'absolute', visibility: 'hidden' }),
  )

  const dismissOverlay = until(merge(overlayClick, dismiss))


  const $popover = switchLatest(
    map($content => {
      return dismissOverlay(
        merge(
          $overlay(),
          contentOps($content),
        )
      )
    }, $$popContentMulticast)
  )


  const targetOp = O(
    targetIntersectionTether(
      observer.intersection()
    ),
    styleBehavior(
      merge(
        constant({ zIndex: 100000, position: 'relative' }, $$popContentMulticast),
        constant(null, overlayClick)
      )
    )
  )

  return [
    $container(
      targetOp($target),
      $popover,
    ),

    { overlayClick }
  ]
})

