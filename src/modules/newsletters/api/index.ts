import { request } from '@/api/generic.api'

export const GET_NEWSLETTERS = ({ params, data }: any) => request({ url: '/api/v1/mailing/get-all/mailings', params, data, method: 'POST' })

export const GET_NEWSLETTERS_COUNT = ({ params }: any) => request({ url: '/api/v1/mailing/get-amount/mailings', params, method: 'GET' })

export const GET_NEWSLETTER = ({ params }: any) => request({ url: '/api/v1/mailing/get-mailing', params, method: 'GET' })

export const GET_KIND_OF_ACTIVITIES = ({ params, data }: any) => request({ url: '/api/v1/mailing/get-activities', params, data, method: 'POST' })

export const GET_COMPANIES = ({ params, data }: any) => request({ url: '/api/v1/mailing/get-recipients', params, data, method: 'POST', file: true })

export const SEND_MAIL = ({ data }: any) => request({ url: '/api/v1/mailing/send-mailing', data, method: 'POST', file: true })

export const DELETE_NEWSLETTER = ({ params }: any) => request({ url: '/api/v1/mailing/remove-mailing', params, method: 'POST' })
