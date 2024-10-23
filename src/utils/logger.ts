import { getDirectoryFromPath, getFileFromPath } from './opfsHelper'
import { format, parseISO, isBefore, subDays } from 'date-fns'

const LOG_DIR = 'logs'
const LOG_EXPIRES_IN_DAY = 30
const MAX_RECORD_IN_FILE = 50000

export const getLogFilePath = (part: number = 1) =>
  `${LOG_DIR}/${format(new Date(), 'yyyyMMdd')}_${part}.jsonl`

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

// this func limit each log file contain 50k line of record
const getLogFile = async (i = 1) => {
  const handle = await getFileFromPath(getLogFilePath(i))
  const currContent = await handle.getContent()
  const numOfLine = currContent.split('\n').length
  console.log(numOfLine)
  if (numOfLine < MAX_RECORD_IN_FILE) {
    return handle
  } else {
    return await getLogFile(i + 1)
  }
}

export const writeLog = async (logs: Log[]) => {
  const handle = await getLogFile()
  const currContent = await handle.getContent()
  const currLogs = currContent.length > 0 ? `${currContent}\n` : ''
  const newLogs = logs.map((log) => JSON.stringify(log)).join('\n')
  handle.writeFile(`${currLogs}${newLogs}`)
}
