import { request } from '@/api/generic.api'

export const GET_REGIONS = ({ params }: any) => request({ url: '/api/v1/persons/get-regions', params, method: 'GET' })
