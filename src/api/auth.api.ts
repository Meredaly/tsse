import { request } from '@/api/generic.api'

export const LOGIN = ({ data }: any) => request({ url: '/api/v1/main/login', data, method: 'POST' })

export const CHECK_AUTH = () => request({ url: '/api/v1/main/get-profile', method: 'GET' })
