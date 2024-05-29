import { request } from '@/api/generic.api'

export const GET_FOREIGN_COMPANIES = ({ params, data }: any) =>
  request({ url: '/api/v1/foreign-company/get-all/companies', data, params, method: 'POST' })

export const GET_FOREIGN_COMPANY = ({ params }: any) =>
  request({ url: '/api/v1/foreign-company/get-company', params, method: 'GET' })

export const GET_FOREIGN_COMPANIES_COUNT = ({ params }: any) =>
  request({ url: '/api/v1/foreign-company/get-amount/companies', params, method: 'GET' })

export const ADD_FOREIGN_COMPANY = ({ data }: any) =>
  request({ url: '/api/v1/foreign-company/add-company', data, file: true, method: 'POST' })

export const EDIT_FOREIGN_COMPANY = ({ data }: any) =>
  request({ url: '/api/v1/foreign-company/edit-company', data, file: true, method: 'POST' })

export const DELETE_FOREIGN_COMPANY = ({ params }: any) =>
  request({ url: '/api/v1/foreign-company/remove-company', params, method: 'POST' })
