import { getFileFromPath } from '../opfsHelper'
import { useState, useCallback } from 'react'

declare global {
  interface Window {
    showOpenFilePicker: () => Promise<FileSystemFileHandle[]>
  }
}

export const OPFSDemo = () => {
  const [filename, setFileName] = useState('')
  const [content, setContent] = useState('')

  const read = useCallback(async () => {
    const file = await getFileFromPath(filename)
    const fileContent = await file.getContent()
    setContent(fileContent)
  }, [filename])
  const write = useCallback(async () => {
    const file = await getFileFromPath(filename)
    await file.writeFile(content)
  }, [content, filename])
  const select = useCallback(async () => {
    if (typeof window.showOpenFilePicker !== 'function') return
    try {
      const [file] = await window.showOpenFilePicker()
      const textFile = await file.getFile()
      setFileName(textFile.name)
      setContent(await textFile.text())
    } catch (e) {
      console.error('This browser does not support showOpenFilePicker', e)
    }
  }, [])

  return (
    <div>
      <div className="flex">
        File:
        <input
          className="border-gray-500 border-solid border-2"
          type="text"
          value={filename}
          onChange={(e) => setFileName(e.target.value)}
        />
      </div>
      <div>
        Content:
        <textarea
          className="border-gray-500 border-solid border-2 w-1/2 h-96"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div>
        <button className="bg-black text-white p-2 m-2" onClick={read}>
          Read
        </button>
        <button className="bg-black text-white p-2 m-2" onClick={write}>
          Write
        </button>
        <button className="bg-black text-white p-2 m-2" onClick={select}>
          Select...
        </button>
      </div>
    </div>
  )
}
