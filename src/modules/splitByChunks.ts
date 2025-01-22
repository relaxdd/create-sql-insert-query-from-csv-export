export default function splitByChunks<T>(array: T[], size: number) {
  if (size < 1) throw new Error('Size must be positive')
  const result: T[][] = []

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }

  return result
}