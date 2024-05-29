import { request } from '@/api/generic.api'

export const GET_COUNTERS = ({ data }: any) => request({ url: '/api/v1/statistics/get-countries/statistics', data, file: true, method: 'POST' })

export const GET_REGIONS = ({ data }: any) => request({ url: '/api/v1/statistics/get-regions/statistics', data, file: true, method: 'POST' })

export const GET_KIND_OF_ACTIVITIES = ({ data }: any) =>
  request({ url: '/api/v1/statistics/get-activities/statistics', data, file: true, method: 'POST' })

export const GET_PAYMENTS = ({ data }: any) => request({ url: '/api/v1/statistics/get-payment/statistics', data, method: 'POST' })

export const GET_TYPE_OF_PROPERTIES = ({ data }: any) => request({ url: '/api/v1/statistics/get-ownership/statistics', data, method: 'POST' })
