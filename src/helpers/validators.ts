export function useValidators() {
  const email = (email: string): boolean => {
    return !!String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  }
  const phoneNumber = (phoneNumber: string): boolean => {
    return !!String(phoneNumber)
      .toLowerCase()
      .match(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-s./0-9]*$/g)
  }

  const site = (site: string): boolean => {
    return !!String(site)
      .toLowerCase()
      .match(/^((ftp|http|https?):\/\/)([A-z]+)\.([A-z]{2,})/)
  }
  const required = (element: any): boolean => {
    return !!element
  }
  return { email, phoneNumber, required, site }
}
