export interface EntrepreneurData {
  uuid: string
  personDTO: {
    uuid: string
    name: string
    surname: string
    patronomicName: string
    birthPlace: string
    birthDate: string
    countryDTO: {
      uuid: string
      name: string
    }
    regionDTO: {
      uuid: string
      name: string
    }
    fullAddressOfResidence: string
    phoneNumber: string
    fax: string
    email: string
    education: string
    experience: string
    knowledgeOfLanguages: string
  }
  membershipApplication: any
  patentCertifyingPayment: any
  entrepreneurStatisticalCodes: any
  certificateOfForeignEconomicRelations: any
  registrationCertificateOfEntrepreneur: any
  certificateOfTaxRegistration: any
  typeActivityDTOS: Item[]
  logo?: {
    extension: string
    name: string
    path: string
    size: number
    uuid: string
  } | null
  webSite: string
  typeWork: string
}

export interface EntrepreneurTable {
  uuid: string
  fullName: string
  birthPlace: string
  birthDate: DataTransfer
  country: string
  region: string
  fullAddressOfResidence: string
  phoneNumber: string
  fax: string
  email: string
  education: string
  experience: string
  knowledgeOfLanguages: string
}

export interface EntrepreneurSave {
  uuid?: string
  entrepreneurUuid?: string
  personUuid: string
  membershipApplicationUuid: string
  certificateOfForeignEconomicRelationsUuid: string
  patentCertifyingPaymentUuid: string
  registrationCertificateOfEntrepreneurUuid: string
  entrepreneurStatisticalCodesUuid: string
  certificateOfTaxRegistrationUuid: string
  typeActivityUuids: string
  webSite: string
  typeWork: string
}

export interface Individual {
  uuid: string
  name: string
}

export interface Item {
  uuid: string
  name: string
}
