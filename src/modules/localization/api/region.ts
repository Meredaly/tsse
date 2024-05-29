import { request } from '@/api/generic.api'

export const GET_REGIONS = ({ params, data }: any) => request({ url: '/api/v1/localization/get-all/regions', params, data, method: 'POST' })

export const GET_REGIONS_COUNT = ({ params }: any) => request({ url: '/api/v1/localization/get-amount/regions', params, method: 'GET' })

export const ADD_REGION = ({ params, data }: any) => request({ url: '/api/v1/localization/add-region', params, data, method: 'POST' })

export const EDIT_REGION = ({ params, data }: any) => request({ url: '/api/v1/localization/edit-region', params, data, method: 'POST' })

export const DELETE_REGION = ({ params }: any) => request({ url: '/api/v1/localization/remove-region', params, method: 'POST' })
