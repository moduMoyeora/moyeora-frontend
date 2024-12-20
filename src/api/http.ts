import axios, { AxiosRequestConfig } from 'axios'
import { getToken, removeToken, useAuthStore } from '../store/authStore'

const BASE_URL = 'https://dev-moyeora.glitch.me'
const DEFAULT_TIMEOUT = 30000

export const createClient = (config?: AxiosRequestConfig) => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: DEFAULT_TIMEOUT,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Authorization: getToken() ? `Bearer ${getToken()}` : '',
    },
    ...config,
  })
  // axiosInstance.interceptors.request.use(
  //   (config) => {
  //     const token = useAuthStore.getState().token
  //     if (token) {
  //       config.headers['Authorization'] = `Bearer ${token}`
  //     }
  //     return config
  //   },
  //   (error) => {
  //     return Promise.reject(error)
  //   }
  // )

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
