import { request } from '@/api/generic.api'

export const GET_INDIVIDUALS = ({ params }: any) => request({ url: '/api/v1/entrepreneur/get-persons', params, method: 'GET' })

export const GET_KIND_OF_ACTIVITIES = ({ params }: any) => request({ url: '/api/v1/entrepreneur/get-activities', params, method: 'GET' })
