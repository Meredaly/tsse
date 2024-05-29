export interface Item {
  uuid: string
  name: string
}

export interface Person {
  uuid: string
  name: string
  surname: string
  patronomicName: string
  fax: null
}

export interface PrivacyCompany {
  uuid: string
  name: string
  fullAddress: string
  phoneNumber: string
  email: string
  fax: string
  webSite: string
  typeWork: string
  countryDTO: Item
  countryName?: string
  regionDTO: Item
  regionName?: string
  director: Person
  founders: Person[]
  typeOwnershipDTO: null
  typeActivityDTOS: Item[]
  typeActivityName?: string
  organizationDTO: Item
  organizationName?: string
  membershipApplication: null
  extractFromUsreo: null
  charterOfTheEnterprise: null
  certificateOfForeignEconomicRelations: null
  certificateOfStateRegistration: null
  paymentOfTheEntranceMembershipFee: null
  founder: string
  logo?: {
    extension: string
    name: string
    path: string
    size: number
    uuid: string
  } | null
}

export interface PrivacyCompanyData {
  uuid?: string
  name: string
  fullAddress: string
  phoneNumber: string
  email: string
  fax: string
  webSite: string
  typeWork: string
  countryUuid: string
  regionUuid: string
  directorUuid: string
  typeActivityUuids: string
  founderUuids: string
  membershipApplicationUuid: string
  extractFromUsreoUuid: string
  charterOfTheEnterpriseUuid: string
  certificateOfForeignEconomicRelationsUuid: string
  certificateOfStateRegistrationUuid: string
  paymentOfTheEntranceMembershipFeeUuid: string
  logoUuid: string
}
