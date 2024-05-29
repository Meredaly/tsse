import { request } from '@/api/generic.api'

export const UPLOAD_FILE = ({ data, onUploadProgress }: any) =>
  request({ url: '/api/v1/file/upload-file', data, onUploadProgress, method: 'POST', file: true })
