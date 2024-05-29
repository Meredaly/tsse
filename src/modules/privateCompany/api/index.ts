import { request } from '@/api/generic.api'

export const GET_PRIVACY_COMPANIES = ({ params, data }: any) =>
  request({ url: '/api/v1/personal-enterprise/get-all/companies', data, params, method: 'POST' })

export const GET_PRIVACY_COMPANY = ({ params }: any) => request({ url: '/api/v1/personal-enterprise/get-company', params, method: 'GET' })

export const GET_PRIVACY_COMPANIES_COUNT = ({ params }: any) =>
  request({ url: '/api/v1/personal-enterprise/get-amount/companies', params, method: 'GET' })

export const ADD_PRIVACY_COMPANY = ({ data }: any) => request({ url: '/api/v1/personal-enterprise/add-company', data, file: true, method: 'POST' })

export const EDIT_PRIVACY_COMPANY = ({ data }: any) => request({ url: '/api/v1/personal-enterprise/edit-company', data, file: true, method: 'POST' })

export const DELETE_PRIVACY_COMPANY = ({ params }: any) => request({ url: '/api/v1/personal-enterprise/remove-company', params, method: 'POST' })
