import { request } from '@/api/generic.api'

export const GET_KIND_OF_ACTIVITIES = ({ params }: any) => request({ url: '/api/v1/commercial-society/get-activities', params, method: 'GET' })

export const GET_COUNTRIES = ({ params }: any) => request({ url: '/api/v1/commercial-society/get-countries', params, method: 'GET' })

export const GET_REGIONS = ({ params }: any) => request({ url: '/api/v1/commercial-society/get-regions', params, method: 'GET' })

export const GET_INDIVIDUALS = ({ params }: any) => request({ url: '/api/v1/commercial-society/get-persons', params, method: 'GET' })
