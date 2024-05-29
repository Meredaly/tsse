import { ref } from 'vue'
import { UPLOAD_FILE } from '@/api/file.api'
const baseURL = import.meta.env.VITE_APP_BASE_URL

export function fileUploader() {
  const fileData = ref({
    uuid: '',
    name: '',
    path: '',
    progress: 0
  })

  const uploadFile = async (files: FileList): Promise<void> => {
    try {
      const onUploadProgress = {
        onUploadProgress: (progressEvent: ProgressEvent): void => {
          fileData.value.progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        }
      }
      fileData.value.name = files[0].name

      const { data } = await UPLOAD_FILE({ data: { file: files[0] }, onUploadProgress })

      fileData.value.path = data.path
      fileData.value.uuid = data.uuid
    } catch (error) {
      console.error(error)
    }
  }

  const openFile = (): void => {
    window.open(`${baseURL}/api/v1/file${fileData.value.path}`, '_blank')
  }

  return {
    fileData,
    uploadFile,
    openFile
  }
}
