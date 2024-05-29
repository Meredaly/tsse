import { request } from '@/api/generic.api'

export const GET_COUNTRIES = ({ params, data }: any) => request({ url: '/api/v1/localization/get-all/countries', params, data, method: 'POST' })

export const GET_COUNTRIES_COUNT = ({ params }: any) => request({ url: '/api/v1/localization/get-amount/countries', params, method: 'GET' })

export const ADD_COUNTRY = ({ data }: any) => request({ url: '/api/v1/localization/add-country', data, method: 'POST' })

export const EDIT_COUNTRY = ({ data }: any) => request({ url: '/api/v1/localization/edit-country', data, method: 'POST' })

export const DELETE_COUNTRY = ({ params }: any) => request({ url: '/api/v1/localization/remove-country', params, method: 'POST' })
