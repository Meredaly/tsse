import { request } from '@/api/generic.api'

export const GET_MEMBERS = ({ params, data }: any) => request({ url: '/api/v1/cocaiot-member/get-members/', data, params, method: 'POST' })

export const GET_MEMBER = ({ params }: any) => request({ url: '/api/v1/cocaiot-member/get-member', params, method: 'GET' })

export const GET_MEMBERS_COUNT = ({ params }: any) => request({ url: '/api/v1/cocaiot-member/get-amount/members', params, method: 'GET' })

export const ADD_MEMBER = ({ data }: any) => request({ url: '/api/v1/cocaiot-member/add-member', data, method: 'POST' })

export const EDIT_MEMBER = ({ params, data }: any) => request({ url: '/api/v1/cocaiot-member/edit-member', params, data, method: 'POST' })

export const DELETE_MEMBER = ({ params }: any) => request({ url: '/api/v1/cocaiot-member/remove-member', params, method: 'POST' })

export const GET_CANDIDATES = ({ params }: any) => request({ url: '/api/v1/cocaiot-member/get-candidates', params, method: 'GET' })

export const GET_CANDIDATE = ({ data }: any) => request({ url: '/api/v1/cocaiot-member/get-candidate', data, method: 'POST' })
