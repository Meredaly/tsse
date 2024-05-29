export const getDate = (date: string): string => {
  if (!date) {
    return ''
  }
  const newDate = new Date(date)

  const day = newDate.getDate().toString().padStart(2, '0')
  const month = (newDate.getMonth() + 1).toString().padStart(2, '0')
  const year = newDate.getFullYear().toString().padStart(4, '0')

  return `${day}.${month}.${year}`
}
