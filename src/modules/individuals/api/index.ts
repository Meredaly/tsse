import { request } from '@/api/generic.api'

export const GET_INDIVIDUALS = ({ params, data }: any) => request({ url: '/api/v1/persons/get-all/persons', params, data, method: 'POST' })

export const GET_INDIVIDUAL = ({ params }: any) => request({ url: '/api/v1/persons/get-person', params, method: 'GET' })

export const GET_INDIVIDUALS_COUNT = ({ params }: any) => request({ url: '/api/v1/persons/get-amount/persons', params, method: 'GET' })

export const ADD_INDIVIDUAL = ({ data }: any) => request({ url: '/api/v1/persons/add-person', data, file: true, method: 'POST' })

export const EDIT_INDIVIDUAL = ({ data }: any) => request({ url: '/api/v1/persons/edit-person', data, file: true, method: 'POST' })

export const REMOVE_INDIVIDUAL = ({ params }: any) => request({ url: '/api/v1/persons/remove-person', params, method: 'POST' })
