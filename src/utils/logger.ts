export enum LOG_TYPE {
  RTC_STATS = 'rtc_stats',
  JS_MEMORY = 'js_memory',
}

export type Log = {
  type: LOG_TYPE
  content: object
}

export const createLog = (type: LOG_TYPE, content: object): Log => ({
  type,
  content,
})
