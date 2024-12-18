import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'

interface StoreState {
  isLoggedIn: boolean
  user_id: string
  storeLogin: (token: string) => void
  storeLogout: () => void
}

export const getToken = () => {
  return localStorage.getItem('token')
}
const setToken = (token: string) => {
  localStorage.setItem('token', token)
}

export const removeToken = () => {
  localStorage.removeItem('token')
}

export const removeUserId = () => {
  localStorage.removeItem('user_id')
}

interface JwtPayload {
  user_id: string
}

export const useAuthStore = create<StoreState>((set) => ({
  isLoggedIn: getToken() ? true : false,
  user_id: getToken() ? localStorage.getItem('user_id') || '' : '',
  storeLogin: (token: string) => {
    setToken(token)
    set({ isLoggedIn: true })
    // const decoded = jwtDecode<JwtPayload>(token)
    // localStorage.setItem('user_id', decoded.user_id)
  },
  storeLogout: () => {
    removeToken()
    set({ isLoggedIn: false })
    removeUserId()
  },
}))
