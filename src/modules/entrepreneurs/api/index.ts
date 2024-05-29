import { request } from '@/api/generic.api'

export const GET_ENTREPRENEURS = ({ params, data }: any) =>
  request({ url: '/api/v1/entrepreneur/get-all/entrepreneurs', params, data, method: 'POST' })

export const GET_ENTREPRENEUR = ({ params }: any) => request({ url: '/api/v1/entrepreneur/get-entrepreneur', params, method: 'GET' })

export const GET_ENTREPRENEURS_COUNT = ({ params }: any) => request({ url: '/api/v1/entrepreneur/get-amount/entrepreneurs', params, method: 'GET' })

export const ADD_ENTREPRENEUR = ({ data }: any) => request({ url: '/api/v1/entrepreneur/add-entrepreneur', data, method: 'POST', file: true })

export const EDIT_ENTREPRENEUR = ({ data }: any) => request({ url: '/api/v1/entrepreneur/edit-entrepreneur', data, method: 'POST', file: true })

export const DELETE_ENTREPRENEUR = ({ params }: any) => request({ url: '/api/v1/entrepreneur/remove-entrepreneur', params, method: 'POST' })
