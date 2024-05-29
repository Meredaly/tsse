export const statsToExcel = (function () {
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

  return function ({
    kindOfActivities,
    typeOfProperties,
    countries,
    regions,
    paymentStatus
  }: {
    kindOfActivities: any
    typeOfProperties: any
    countries: any
    regions: any
    paymentStatus: any
  }) {
    const table = document.createElement('table')
    const kindOfActivitiesHeadRow = document.createElement('tr')
    const kindOfActivitiesHeadColName = document.createElement('th')
    const kindOfActivitiesHeadColAmountMember = document.createElement('th')
    const kindOfActivitiesHeadColPercent = document.createElement('th')

    kindOfActivitiesHeadColName.append('Iş görnüşi')
    kindOfActivitiesHeadColAmountMember.append('Agzalaryň sany')
    kindOfActivitiesHeadColPercent.append('Göterim')
    kindOfActivitiesHeadRow.append(kindOfActivitiesHeadColName, kindOfActivitiesHeadColAmountMember, kindOfActivitiesHeadColPercent)
    table.append(kindOfActivitiesHeadRow)

    kindOfActivities.forEach((kindOfActivity: any) => {
      const row = document.createElement('tr')
      const name = document.createElement('td')
      const amountMember = document.createElement('td')
      const percent = document.createElement('td')
      name.append(kindOfActivity.name)
      amountMember.append(kindOfActivity.amountMember)
      percent.append(Math.round(Number(kindOfActivity.procent)).toString())
      row.append(name, amountMember, percent)
      table.append(row)
    })
    table.append(document.createElement('tr'))
    table.append(document.createElement('tr'))

    const typesOwnership = {
      COMMERCIAL_SOCIETY: 'Işewür kompaniýalar',
      PERSONAL_ENTERPRISE: 'Hususy kärhanalar',
      FOREIGN_COMPANY: 'Daşary ýurt kompaniýalary',
      STATE_ORGANIZATION: 'Döwlet guramalary',
      ENTREPRENEUR: 'Telekeçiler'
    } as any

    const typeOfPropertiesHeadRow = document.createElement('tr')
    const typeOfPropertiesHeadColName = document.createElement('th')
    const typeOfPropertiesHeadColAmountMember = document.createElement('th')
    const typeOfPropertiesHeadColPercent = document.createElement('th')

    typeOfPropertiesHeadColName.append('Emläk görnüşi')
    typeOfPropertiesHeadColAmountMember.append('Agzalaryň sany')
    typeOfPropertiesHeadColPercent.append('Göterim')
    typeOfPropertiesHeadRow.append(typeOfPropertiesHeadColName, typeOfPropertiesHeadColAmountMember, typeOfPropertiesHeadColPercent)
    table.append(typeOfPropertiesHeadRow)

    typeOfProperties.forEach((typeOfProperty: any) => {
      const row = document.createElement('tr')
      const name = document.createElement('td')
      const amountMember = document.createElement('td')
      const percent = document.createElement('td')
      name.append(typesOwnership[typeOfProperty.name])
      amountMember.append(typeOfProperty.amountMember)
      percent.append(Math.round(Number(typeOfProperty.procent)).toString())
      row.append(name, amountMember, percent)
      table.append(row)
    })

    table.append(document.createElement('tr'))
    table.append(document.createElement('tr'))

    const countriesHeadRow = document.createElement('tr')
    const countriesHeadColName = document.createElement('th')
    const countriesHeadColAmountMember = document.createElement('th')
    const countriesHeadColPercent = document.createElement('th')

    countriesHeadColName.append('Ýurt')
    countriesHeadColAmountMember.append('Agzalaryň sany')
    countriesHeadColPercent.append('Göterim')
    countriesHeadRow.append(countriesHeadColName, countriesHeadColAmountMember, countriesHeadColPercent)
    table.append(countriesHeadRow)

    countries.forEach((country: any) => {
      const row = document.createElement('tr')
      const name = document.createElement('td')
      const amountMember = document.createElement('td')
      const percent = document.createElement('td')
      name.append(country.name)
      amountMember.append(country.amountMember)
      percent.append(Math.round(Number(country.procent)).toString())
      row.append(name, amountMember, percent)
      table.append(row)
    })
    table.append(document.createElement('tr'))
    table.append(document.createElement('tr'))

    const regionsHeadRow = document.createElement('tr')
    const regionsHeadColName = document.createElement('th')
    const regionsHeadColAmountMember = document.createElement('th')
    const regionsHeadColPercent = document.createElement('th')

    regionsHeadColName.append('Sebit')
    regionsHeadColAmountMember.append('Agzalaryň sany')
    regionsHeadColPercent.append('Göterim')
    regionsHeadRow.append(regionsHeadColName, regionsHeadColAmountMember, regionsHeadColPercent)
    table.append(regionsHeadRow)

    regions.forEach((region: any) => {
      const row = document.createElement('tr')
      const name = document.createElement('td')
      const amountMember = document.createElement('td')
      const percent = document.createElement('td')
      name.append(region.name)
      amountMember.append(region.amountMember)
      percent.append(Math.round(Number(region.procent)).toString())
      row.append(name, amountMember, percent)
      table.append(row)
    })
    table.append(document.createElement('tr'))
    table.append(document.createElement('tr'))

    const paymentStatusHeadRow = document.createElement('tr')
    const paymentStatusHeadColName = document.createElement('th')
    const paymentStatusHeadColAmountMember = document.createElement('th')
    const paymentStatusHeadColPercent = document.createElement('th')

    paymentStatusHeadColName.append('TPPT agzalary')
    paymentStatusHeadColAmountMember.append('Agzalaryň sany')
    paymentStatusHeadColPercent.append('Göterim')
    paymentStatusHeadRow.append(paymentStatusHeadColName, paymentStatusHeadColAmountMember, paymentStatusHeadColPercent)
    table.append(paymentStatusHeadRow)

    const allRow = document.createElement('tr')
    const allName = document.createElement('td')
    const allAmountMember = document.createElement('td')
    const allPercent = document.createElement('td')

    allName.append('Hemmesi')
    allAmountMember.append(paymentStatus.reduce((sum: number, status: any) => (sum += status.amountMember), 0).toString())
    allRow.append(allName, allAmountMember, allPercent)
    table.append(allRow)

    const paidRow = document.createElement('tr')
    const paidName = document.createElement('td')
    const paidAmountMember = document.createElement('td')
    const paidPercent = document.createElement('td')

    const noPaidRow = document.createElement('tr')
    const noPaidName = document.createElement('td')
    const noPaidAmountMember = document.createElement('td')
    const noPaidPercent = document.createElement('td')

    paidName.append('Tölenen')

    noPaidName.append('Wagtyň doldy')

    paymentStatus.forEach((item: any) => {
      if (item.name === 'PAID') {
        paidAmountMember.append(item.amountMember)
        paidPercent.append(Math.round(item.procent).toString())
      }
      if (item.name === 'PAYMENT_TIME_HAS_EXPIRED') {
        noPaidAmountMember.append(item.amountMember)
        noPaidPercent.append(Math.round(item.procent).toString())
      }
    })

    paidRow.append(paidName, paidAmountMember, paidPercent)

    noPaidRow.append(noPaidName, noPaidAmountMember, noPaidPercent)
    table.append(paidRow, noPaidRow)

    var ctx = { worksheet: 'Statistika' || 'Worksheet', table: table.innerHTML }
    var result = uri + base64(format(template, ctx))
    downloadURI(result, 'Statistika.xls')
  }
})()
