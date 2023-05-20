import { Behavior, combineArray, fromCallback, O, Op } from "@aelea/core"
import { $wrapNativeElement, component, INode, style, drawLatest } from "@aelea/dom"
import { observer } from '@aelea/ui-components'
import { pallete } from '@aelea/ui-components-theme'
import { empty, filter, map, mergeArray, multicast, now, switchLatest } from '@most/core'
import { disposeWith } from '@most/disposable'
import { Stream } from '@most/types'
import { ChartOptions, createChart, CrosshairMode, DeepPartial, IChartApi, ISeriesApi, LineStyle, MouseEventParams, SeriesDataItemTypeMap, SeriesMarker, SeriesType, Time, TimeRange } from 'lightweight-charts'

export interface IMarker extends SeriesMarker<Time> {

}

export interface IChart<T extends SeriesType> {
  chartConfig?: DeepPartial<ChartOptions>
  realtimeSource?: Stream<SeriesDataItemTypeMap[T]>

  containerOp?: Op<INode, INode>

  markers?: Stream<IMarker[]>

  initializeSeries: Op<IChartApi, ISeriesApi<T>>
}

export const $Chart = <T extends SeriesType>({ chartConfig, realtimeSource, initializeSeries, containerOp = O(), markers = empty() }: IChart<T>) => component((
  // [sampleCrosshairMove, crosshairMove]: Behavior<MouseEventParams, MouseEventParams>,
  [containerDimension, sampleContainerDimension]: Behavior<INode, ResizeObserverEntry[]>
) => {

  const containerEl = document.createElement('chart')



  const api = createChart(containerEl, {
    rightPriceScale: {
      visible: false,
    },
    handleScale: {

    },
    grid: {
      horzLines: {
        color: '#eee',
        visible: false,
      },
      vertLines: {
        color: 'transparent',
        visible: false
      },
    },
    overlayPriceScales: {
      borderVisible: false,
    },
    leftPriceScale: {
      visible: false,
      scaleMargins: {
        bottom: 0,
        top: 0,
      }
    },
    layout: {
      textColor: pallete.message,
      background: {
        color: 'transparent'
      },
      fontFamily: 'Moderat',
      fontSize: 12
    },
    timeScale: {
      rightOffset: 0,
      secondsVisible: true,
      timeVisible: true,
      lockVisibleTimeRangeOnResize: true,

    },
    crosshair: {
      mode: CrosshairMode.Magnet,
      horzLine: {
        // visible: false,
        labelBackgroundColor: pallete.foreground,
        // labelVisible: false,
        color: pallete.indeterminate,
        width: 1,
        style: LineStyle.Dotted,
      },
      vertLine: {
        color: pallete.indeterminate,
        labelBackgroundColor: pallete.foreground,
        width: 1,
        style: LineStyle.Dotted,
      }
    },
    ...chartConfig
  })



  const crosshairMove = fromCallback<MouseEventParams>(
    cb => {
      api.subscribeCrosshairMove(cb)
      disposeWith(handler => api.unsubscribeCrosshairMove(handler), cb)
    }
  )
  const click = multicast(
    fromCallback<MouseEventParams>(cb => {
      api.subscribeClick(cb)
      disposeWith(handler => api.unsubscribeClick(handler), cb)
    })
  )

  const timeScale = api.timeScale()


  const visibleLogicalRangeChange = multicast(
    fromCallback(cb => {
      timeScale.subscribeVisibleLogicalRangeChange(cb)
      disposeWith(handler => timeScale.subscribeVisibleLogicalRangeChange(handler), cb)
    })
  )

  const visibleTimeRangeChange = multicast(
    fromCallback<TimeRange | null>(cb => {
      timeScale.subscribeVisibleTimeRangeChange(cb)
      disposeWith(handler => timeScale.unsubscribeVisibleTimeRangeChange(handler), cb)
    })
  )



  const init = multicast(initializeSeries(now(api)))

  const ignoreAll = filter(() => false)
  return [
    $wrapNativeElement(containerEl)(
      style({ position: 'relative', minHeight: '30px' }),
      sampleContainerDimension(observer.resize()),
      containerOp,
    )(
      ignoreAll(mergeArray([
        combineArray((seriesApi, [containerDimension]) => {
          const { width, height } = containerDimension.contentRect
          api.resize(width, height)

          return empty()
        }, init, drawLatest(containerDimension)),

        switchLatest(combineArray((seriesApi) => {
          return realtimeSource ? map(data => {
            seriesApi.update(data)

            timeScale.fitContent()
            return 
          }, realtimeSource) : empty()
        }, init)),
      ]))
    ),

    {
      crosshairMove,
      click,
      visibleLogicalRangeChange,
      visibleTimeRangeChange,
      containerDimension
    }
  ]
})


