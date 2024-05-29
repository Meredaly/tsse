import { request } from '@/api/generic.api'

export const GET_ORGANIZATIONS = ({ params }: any) => request({ url: '/api/v1/state_organization/get-organizations', params, method: 'GET' })

export const GET_KIND_OF_ACTIVITIES = ({ params }: any) => request({ url: '/api/v1/state_organization/get-activities', params, method: 'GET' })

export const GET_REGIONS = ({ params }: any) => request({ url: '/api/v1/state_organization/get-regions', params, method: 'GET' })

export const GET_INDIVIDUALS = ({ params }: any) => request({ url: '/api/v1/state_organization/get-persons', params, method: 'GET' })
