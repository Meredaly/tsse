export interface Individual {
  uuid: string
  name: string
  surname: string
  fullName?: string
  patronomicName: string
  birthPlace: string
  birthDate: string
  countryUuid?: string
  regionUuid?: string
  fullAddressOfResidence: string
  phoneNumber: string
  fax: string
  email: string
  education: string
  experience: string
  knowledgeOfLanguages: string
  country?: string
  region?: string
  countryDTO?: {
    uuid: string
    name: string
  }
  regionDTO?: {
    uuid: string
    name: string
  }
  directorCompanies?: Item[]
  founderCompanies?: Item[]
  isEntrepreneur?: boolean
  imageUuid?: string
  image?: {
    extension: string
    name: string
    path: string
    size: number
    uuid: string
  } | null
  copyPassportUuid?: string
  copyPassport?: {
    extension: string
    name: string
    path: string
    size: number
    uuid: string
  } | null
}
export interface Item {
  uuid: string
  name: string
}
export interface Country {
  uuid: string
  name: string
}

export interface Region {
  uuid: string
  name: string
}
