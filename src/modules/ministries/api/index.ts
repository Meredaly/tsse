import { request } from '@/api/generic.api'

export const GET_MINISTRIES = ({ params, data }: any) => request({ url: '/api/v1/organization/get-all/organizations', params, data, method: 'POST' })

export const GET_MINISTRIES_COUNT = ({ params }: any) => request({ url: '/api/v1/organization/get-amount/organizations', params, method: 'GET' })

export const ADD_MINISTRY = ({ data }: any) => request({ url: '/api/v1/organization/add-organization', data, method: 'POST' })

export const EDIT_MINISTRY = ({ data }: any) => request({ url: '/api/v1/organization/edit-organization', data, method: 'POST' })

export const REMOVE_MINISTRY = ({ params }: any) => request({ url: '/api/v1/organization/remove-organization', params, method: 'POST' })
