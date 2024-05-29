export interface TableHeadItem {
  uuid: string
  sort: boolean
  visibility: boolean
  key: string
  title: string
}

export interface Request {
  url: string
  method: string
  headers?: any
  params?: object
  data?: object
  onUploadProgress?: any
  file?: boolean
}

export interface SelectCheckboxItem {
  uuid: string
  name: string
}
