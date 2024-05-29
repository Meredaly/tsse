export const tableToExcel = (function () {
  var uri = 'data:application/vnd.ms-excel;base64,',
    template =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>',
    base64 = function (s: string | number | boolean) {
      return window.btoa(unescape(encodeURIComponent(s)))
    },
    format = function (s: string, c: { [x: string]: any; worksheet?: any; table?: string }) {
      return s.replace(/{(\w+)}/g, function (_m, p) {
        return c[p]
      })
    },
    downloadURI = function (url: string, name: string) {
      var link = document.createElement('a')
      link.download = name
      link.href = url
      link.click()
    }

  return function ({ head, body, name, fileName }: { head: any; body: any; name: string; fileName: string }) {
    const table = document.createElement('table')
    const theadRow = document.createElement('tr')

    const theadNumber = document.createElement('th')
    theadNumber.append('Номер')
    theadRow.append(theadNumber)

    head.forEach((headItem: any) => {
      const th = document.createElement('th')

      if (headItem.visibility) {
        th.append(headItem.title)
        theadRow.append(th)
      }
    })
    table.append(theadRow)
    body.forEach((bodyItem: any, index: number) => {
      const tr = document.createElement('tr')

      const td = document.createElement('td')
      td.append((index + 1).toString())
      tr.append(td)

      head.forEach((headItem: any) => {
        const td = document.createElement('td')

        if (headItem.visibility) {
          const bodyItemValue = bodyItem[headItem.key]
          td.append(bodyItemValue)
          tr.append(td)
        }
      })
      table.append(tr)
    })

    var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
    var result = uri + base64(format(template, ctx))
    downloadURI(result, fileName)
  }
})()
