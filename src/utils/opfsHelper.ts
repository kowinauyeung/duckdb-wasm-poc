const getRoot = async () => {
  const opfsRoot = await navigator.storage.getDirectory()
  return opfsRoot
}

const getDirectory = async (
  dirName: string,
  parent?: FileSystemDirectoryHandle,
) => {
  const parentDir = parent ?? (await getRoot())
  const dir = await parentDir.getDirectoryHandle(dirName, {
    create: true,
  })
  return dir
}

const getFile = async (
  filename: string,
  parent?: FileSystemDirectoryHandle,
) => {
  const parentDir = parent ?? (await getRoot())
  const file = await parentDir.getFileHandle(filename, {
    create: true,
  })
  return file
}

const writeFile = async (
  file: FileSystemFileHandle,
  contentToWrite: string,
) => {
  const writable = await file.createWritable()
  await writable.write(contentToWrite)
  await writable.close()
}

const getFileContent = async (file: FileSystemFileHandle) => {
  const fileGot = await file.getFile()
  return await fileGot.text()
}

const OPFSFile = (file: FileSystemFileHandle) => ({
  writeFile: (text: string) => writeFile(file, text),
  getContent: () => getFileContent(file),
})

export const getDirectoryFromPath = async (path: string) => {
  const paths = path.split('/')
  let parent: FileSystemDirectoryHandle | undefined = undefined
  for (const p in paths) {
    parent = await getDirectory(paths[p], parent)
  }
  return parent
}

export const getFileFromPath = async (path: string) => {
  const paths = path.split('/')
  const filename = paths.pop()
  if (!filename) throw 'Invalid path.'
  const parentDir = await getDirectoryFromPath(paths.join('/'))
  if (!parentDir) throw 'Invalid directory'
  return OPFSFile(await getFile(filename, parentDir))
}
