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

export interface GovernmentOrganization {
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
  logo?: {
    extension: string
    name: string
    path: string
    size: number
    uuid: string
  } | null
}

export interface GovernmentOrganizationData {
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
  organizationUuid: string
  typeActivityUuids: string
  membershipApplicationUuid: string
  extractFromUsreoUuid: string
  charterOfTheEnterpriseUuid: string
  certificateOfForeignEconomicRelationsUuid: string
  certificateOfStateRegistrationUuid: string
  paymentOfTheEntranceMembershipFeeUuid: string
  logoUuid: string
}
