import { map, periodic } from "@most/core"
import { intervalTimeMap } from "./constant.js"
import { unixTimestampNow } from "./utils.js"


const intervals = [
  { label: 'year', seconds: intervalTimeMap.MONTH * 12 },
  { label: 'month', seconds: intervalTimeMap.MONTH },
  { label: 'day', seconds: intervalTimeMap.HR24 },
  { label: 'hr', seconds: intervalTimeMap.MIN * 60 },
  { label: 'min', seconds: intervalTimeMap.MIN },
  { label: 'sec', seconds: intervalTimeMap.SEC }
] as const

export function timeSince(time: number) {
  const timeDelta = Math.abs(unixTimestampNow() - time)
  const interval = intervals.find(i => i.seconds < timeDelta)

  if (!interval) {
    return 'now'
  }

  const count = Math.floor(timeDelta / interval.seconds)
  return `${count} ${interval.label}${count !== 1 ? 's' : ''}`
}

export const everySec = map(unixTimestampNow, periodic(1000))

export const displayDate = (unixTime: number | bigint) => {
  return `${new Date(Number(unixTime) * 1000).toDateString()} ${new Date(Number(unixTime) * 1000).toLocaleTimeString()}`
}

export const countdown = (targetDate: number) => {
  return map(now => countdownFn(targetDate, now), everySec)
}

export function countdownFn(targetDate: number | bigint, now: number | bigint) {
  const distance = Number(targetDate) - Number(now)

  const days = Math.floor(distance / (60 * 60 * 24))
  const hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((distance % (60 * 60)) / 60)
  const seconds = Math.floor(distance % 60)

  return `${days ? days + "d " : ''} ${hours ? hours + "h " : ''} ${minutes ? minutes + "m " : ''} ${seconds ? seconds + "s " : ''}`
}
