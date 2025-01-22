import createSqlInsertQueryFromCsvExport from './index'

// declare var increment: number
// declare var csvDataChunks: string[]

// ;((csvData) => {
//   increment++

//   return createSqlInsertQueryFromCsvExport({
//     csvData,
//     tableName: 'public.wshd_order_incidents',
//     tableColumns: ['code', 'time', 'text', 'avr_code', 'avr_text', 'orders_in_work_shift_data_id'],
//     removeHeader: true,
//     skipRowIfNullableCols: { code: true },
//     replaceColIfNullable: { time: '0' },
//   })
// })(csvDataChunks[increment])

;((csvData) => {
  const tableColumns = ['code', 'time', 'text', 'avr_code', 'avr_text', 'wshd_order_id']

  return createSqlInsertQueryFromCsvExport({
    csvData,
    tableName: 'public.wshd_order_incidents',
    tableColumns: tableColumns,
    removeHeader: false,
    skipRowIfNullableCols: { code: true },
    replaceColIfNullable: { time: '0' },
  })
})(``)
