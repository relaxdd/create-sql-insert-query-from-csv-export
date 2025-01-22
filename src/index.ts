import isNumberInRange from './modules/isNumberInRange'
import splitByChunks from './modules/splitByChunks'

interface ConvertCsvToSqlQueryPayload<Columns extends string> {
  csvData: string
  tableName: string
  tableColumns: Columns[]
  removeHeader?: boolean
  skipRowIfNullableCols?: Partial<Record<Columns, true>>
  replaceColIfNullable?: Partial<Record<Columns, string>>
}

export default function createSqlInsertQueryFromCsvExport<T extends string>({
  csvData,
  tableName,
  tableColumns,
  removeHeader = true,
  skipRowIfNullableCols = {},
  replaceColIfNullable = {},
}: ConvertCsvToSqlQueryPayload<T>) {
  const QuoteSymbol = '"'
  const NullValue = 'NULL'

  let query =
    'INSERT INTO ' + tableName + ' (' + tableColumns.map((column) => `"${column}"`).join(', ') + ') VALUES\n\t'

  function replaceQuotes(value: string) {
    if (value === NullValue) return value
    if (!(value.startsWith(QuoteSymbol) && value.endsWith(QuoteSymbol))) return value

    return `'${value.slice(1, -1)}'`
  }

  function findRealSeparators(str: string) {
    const commaIdx = [...str.matchAll(',' as any)].map((it) => it.index)
    const quiteIdx = [...str.matchAll(QuoteSymbol as any)].map((it) => it.index)
    const quotesIdxMap = splitByChunks(quiteIdx, 2) as ([number, number] | [number])[]

    return commaIdx.filter((idx) => {
      return !quotesIdxMap.some((range) => {
        return range.length === 2 ? isNumberInRange(idx, range) : false
      })
    })
  }

  function prepareCsvLine(str: string) {
    const arr = str.split(',').map((it) => it.trim())

    if (arr.length !== tableColumns.length) {
      const indexes = [-1].concat(findRealSeparators(str))
      const saftyArr: string[] = []

      for (const [i, pos] of indexes.entries()) {
        const next = indexes?.[i + 1]
        const part = str.slice(pos + 1, next)

        saftyArr.push(part)
      }

      return saftyArr
    }

    return arr
  }

  const csvArr = csvData.trim().split('\n')
  if (removeHeader) csvArr.shift()

  const resArr = csvArr.reduce<string[]>((arr, line) => {
    const prepare = prepareCsvLine(line)

    const object = tableColumns.reduce<Record<T, string>>((acc, column, i) => {
      const value = String(prepare?.[i] ?? NullValue)
      const isNeedReplace = Object.hasOwn(replaceColIfNullable, column) && value.toUpperCase() === NullValue

      if (!isNeedReplace) acc[column] = value
      else acc[column] = replaceColIfNullable[column]!

      return acc
    }, {} as never)

    const excludeKeys = Object.keys(skipRowIfNullableCols) as T[]

    if (excludeKeys.length > 0) {
      const isSkipRow = excludeKeys.some((key) => {
        const it = (object?.[key] ?? NullValue).toUpperCase()
        return it === NullValue
      })

      if (isSkipRow) return arr
    }

    arr.push('(' + tableColumns.map((column) => replaceQuotes(object[column])).join(', ') + ')')
    return arr
  }, [])

  query = query + resArr.join(',\n\t') + ';'
  return query
}
