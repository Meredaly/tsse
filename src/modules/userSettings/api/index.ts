import { request } from '@/api/generic.api'

export const GET_JOB_TITLES = ({ params, data }: any) => request({ url: '/api/v1/setting/get-all/roles', params, data, method: 'POST' })

export const GET_JOB_TITLES_COUNT = ({ params }: any) => request({ url: '/api/v1/setting/get-amount/roles', params, method: 'GET' })

export const GET_JOB_TITLE = ({ params }: any) => request({ url: '/api/v1/setting/get-role', params, method: 'GET' })

export const GET_JOB_CATEGORIES = () => request({ url: '/api/v1/setting/get-all/categories', method: 'GET' })

export const ADD_JOB_TITLE = ({ data }: any) => request({ url: '/api/v1/setting/add-role', data, file: true, method: 'POST' })

export const EDIT_JOB_TITLE = ({ data }: any) => request({ url: '/api/v1/setting/edit-role', data, file: true, method: 'POST' })

export const DELETE_JOB_TITLE = ({ params }: any) => request({ url: '/api/v1/setting/remove-role', params, method: 'POST' })

// =========================================================================================================================================

export const GET_JOB_TITLES_KEY = ({ params }: any) => request({ url: '/api/v1/setting/get-roles', params, method: 'GET' })

export const GET_USERS = ({ params, data }: any) => request({ url: '/api/v1/setting/get-all/users', params, data, method: 'POST' })

export const GET_USERS_COUNT = ({ params }: any) => request({ url: '/api/v1/setting/get-amount/users', params, method: 'GET' })

export const GET_USER = ({ params, data }: any) => request({ url: '/api/v1/setting/get-user', params, data, method: 'GET' })

export const ADD_USER = ({ data }: any) => request({ url: '/api/v1/setting/add-user', data, file: true, method: 'POST' })

export const EDIT_USER = ({ data }: any) => request({ url: '/api/v1/setting/edit-user', data, file: true, method: 'POST' })

export const DELETE_USER = ({ params }: any) => request({ url: '/api/v1/setting/remove-user', params, method: 'POST' })
