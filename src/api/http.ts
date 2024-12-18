import axios, { AxiosRequestConfig } from 'axios'
import { getToken, removeToken } from '../store/authStore'

const BASE_URL = 'http://dev-moyeora.glitch.me'
const DEFAULT_TIMEOUT = 30000

export const createClient = (config?: AxiosRequestConfig) => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: DEFAULT_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    withCredentials: true,
    ...config,
  })
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 403) {
        removeToken()
        window.location.href = '/login'
        return
      }
      return Promise.reject(error)
    }
  )
  return axiosInstance
}
