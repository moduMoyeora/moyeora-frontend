import axios, { AxiosRequestConfig } from 'axios'
import { useAuthStore } from '../store/authStore'

const BASE_URL = 'https://dev-moyeora.glitch.me'
const DEFAULT_TIMEOUT = 30000

export const createClient = (config?: AxiosRequestConfig) => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: DEFAULT_TIMEOUT,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  })

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 403) {
        useAuthStore.getState().storeLogout()
        window.location.href = '/login'
        return Promise.reject(error)
      }
      return Promise.reject(error)
    }
  )
  return axiosInstance
}
export const httpClient = createClient()
