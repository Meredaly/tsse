import { request } from '@/api/generic.api'

export const GET_GOVERNMENT_ORGANIZATIONS = ({ params, data }: any) =>
  request({ url: '/api/v1/state_organization/get-all/companies', data, params, method: 'POST' })

export const GET_GOVERNMENT_ORGANIZATION = ({ params }: any) => request({ url: '/api/v1/state_organization/get-company', params, method: 'GET' })

export const GET_GOVERNMENT_ORGANIZATIONS_COUNT = ({ params }: any) =>
  request({ url: '/api/v1/state_organization/get-amount/companies', params, method: 'GET' })

export const ADD_GOVERNMENT_ORGANIZATION = ({ data }: any) =>
  request({ url: '/api/v1/state_organization/add-company', data, file: true, method: 'POST' })

export const EDIT_GOVERNMENT_ORGANIZATION = ({ data }: any) =>
  request({ url: '/api/v1/state_organization/edit-company', data, file: true, method: 'POST' })

export const DELETE_GOVERNMENT_ORGANIZATION = ({ params }: any) =>
  request({ url: '/api/v1/state_organization/remove-company', params, method: 'POST' })
