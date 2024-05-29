export interface Country {
  uuid: string
  name: string
  amountCompany?: number
}

export interface Region {
  uuid: string
  name: string
  amountCompany?: number
  countryName?: string
  countryDTO?: {
    uuid: string
    name: string
  }
}
