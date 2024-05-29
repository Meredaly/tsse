import { request } from '@/api/generic.api'

export const GET_KIND_OF_ACTIVITIES = ({ params, data }: any) =>
  request({ url: '/api/v1/type_activity/get-all/activity', params, data, method: 'POST' })

export const GET_KIND_OF_ACTIVITIES_COUNT = ({ params }: any) => request({ url: '/api/v1/type_activity/get-amount/activity', params, method: 'GET' })

export const ADD_KIND_OF_ACTIVITY = ({ data }: any) => request({ url: '/api/v1/type_activity/add-activity', data, method: 'POST' })

export const EDIT_KIND_OF_ACTIVITY = ({ data }: any) => request({ url: '/api/v1/type_activity/edit-activity', data, method: 'POST' })

export const REMOVE_KIND_OF_ACTIVITY = ({ params }: any) => request({ url: '/api/v1/type_activity/remove-activity', params, method: 'POST' })
