import { getDirectoryFromPath, getFileFromPath } from './opfsHelper'
import { format, parseISO, isBefore, subDays } from 'date-fns'

const LOG_DIR = 'logs'
const FILE_NAME = 'log'
const LOG_EXPIRES_IN_DAY = 30

export const getLogFilePath = () =>
  `${LOG_DIR}/${FILE_NAME}_${format(new Date(), 'yyyyMMdd')}.jsonl`

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

export const removeExpiredLogFile = async () => {
  const logDir = await getDirectoryFromPath(LOG_DIR)
  if (!logDir) return
  for await (const [name, handle] of logDir.entries()) {
    if (handle.kind !== 'file') continue
    const dateFromFileName = name.match(/\d{8}/)?.join('')
    if (!dateFromFileName) continue
    const createdDate = parseISO(dateFromFileName + 'T00:00:00Z')
    const today = new Date()
    if (isBefore(createdDate, subDays(today, LOG_EXPIRES_IN_DAY))) {
      logDir.removeEntry(name)
    }
  }
}

export const writeLog = async (logs: Log[]) => {
  const handle = await getFileFromPath(getLogFilePath())
  const currContent = await handle.getContent()
  const currLogs = currContent.length > 0 ? `${currContent}\n` : ''
  const newLogs = logs.map((log) => JSON.stringify(log)).join('\n')
  handle.writeFile(`${currLogs}${newLogs}`)
}
