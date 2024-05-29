import { request } from '@/api/generic.api'

export const GET_COUNTRIES = ({ params }: any) => request({ url: '/api/v1/persons/get-countries', params, method: 'GET' })
