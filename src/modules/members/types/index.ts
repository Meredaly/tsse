export interface Member {
  uuid: string
  name: string
  typeActivities: string
  typeOwnership: string
  address: string
  statusPayment: string
  country: string
  region: string
}

export interface SelectedCandidate {
  name: string
  componyType: string
  kindOfActivity: string
  director: string
  address: string
  phoneNumber: string
  email: string
}

export interface Company {
  uuid: string
  name: string
  fax: string
  webSite: string
  membershipApplication: null
  extractFromUsreo: null
  charterOfTheEnterprise: null
  certificateOfForeignEconomicRelations: null
  certificateOfStateRegistration: null
  paymentOfTheEntranceMembershipFee: null
}

export interface Entrepreneur {
  uuid: string
  personDTO: {
    uuid: string
    name: string
    surname: string
    patronomicName: string
    fax: null
    directorCompanies: null
    founderCompanies: null
    isEntrepreneur: null
  }
  membershipApplication: null
  patentCertifyingPayment: null
  entrepreneurStatisticalCodes: null
  certificateOfForeignEconomicRelations: null
  registrationCertificateOfEntrepreneur: null
  certificateOfTaxRegistration: null
}

export interface Candidate {
  companyDTO: Company | null
  entrepreneurDTO: Entrepreneur | null
  typeCocaiotMember: string
}

export interface Item {
  uuid: string
  name: string
  typeCocaiotMember: string
}

export interface MemberPreview {
  ministry: string
  name: string
  kindOfActivity: string
  typeOfProperty: string
  director: string
  directorPhoneNumber: string
  founder: string
  phoneNumber: string
  fax: string
  site: string
  email: string
  country: string
  region: string
  address: string
  isMember: string
  initialDate: string
  finalDate: string
  paymentStatus: string
  initialDateLastPayment: string
}
