export interface JobTitleData {
  uuid?: string
  name: string
  categoryUuids: string
  privilages: string
}

export interface JobTitle {
  uuid: string
  name?: string
  roleName: string
}

export interface User {
  uuid: string
  fullName: string
  roleName: string
}

export interface UserData {
  uuid?: string
  name: string
  surname: string
  patronomicName: string
  email: string
  password: string
  roleUuid: string
}

export interface Item {
  uuid: string
  name: string
}
