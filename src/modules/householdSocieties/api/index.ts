import { request } from '@/api/generic.api'

export const GET_HOUSEHOLD_SOCIETIES = ({ params, data }: any) =>
  request({ url: '/api/v1/commercial-society/get-all/companies', data, params, method: 'POST' })

export const GET_HOUSEHOLD_SOCIETY = ({ params }: any) => request({ url: '/api/v1/commercial-society/get-company', params, method: 'GET' })

export const GET_HOUSEHOLD_SOCIETIES_COUNT = ({ params }: any) =>
  request({ url: '/api/v1/commercial-society/get-amount/companies', params, method: 'GET' })

export const ADD_HOUSEHOLD_SOCIETY = ({ data }: any) => request({ url: '/api/v1/commercial-society/add-company', data, file: true, method: 'POST' })

export const EDIT_HOUSEHOLD_SOCIETY = ({ data }: any) => request({ url: '/api/v1/commercial-society/edit-company', data, file: true, method: 'POST' })

export const DELETE_HOUSEHOLD_SOCIETY = ({ params }: any) => request({ url: '/api/v1/commercial-society/remove-company', params, method: 'POST' })
