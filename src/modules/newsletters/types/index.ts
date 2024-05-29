export interface Newsletter {
  uuid: string
  mailingName: string
  typeMailing: string
  typeActivityName: string
  companyName: string
  companyTypeOwnership: string
}

export interface Item {
  uuid: string
  name: string
  recipientName?: string
  memberType?: string
}
