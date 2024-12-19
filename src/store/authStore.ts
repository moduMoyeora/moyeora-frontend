import { createJSONStorage, persist } from 'zustand/middleware'

import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'

interface StoreState {
  isLoggedIn: boolean
  user_id: string
  token: string
  storeLogin: (token: string) => void
  storeLogout: () => void
}

interface JwtPayload {
  id: string
  exp: number // expiration time in seconds
}

function decodeToken(token: string): JwtPayload {
  try {
    const decoded: any = jwtDecode(token) // JWT 디코딩
    return decoded
  } catch (error) {
    console.error('JWT 디코딩 오류:', error)
    return {} as JwtPayload // 에러 발생 시 빈 객체 반환
  }
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

export const getUserId = () => {
  return localStorage.getItem('user_id')
}
export const removeUserId = () => {
  localStorage.removeItem('user_id')
}

interface JwtPayload {
  user_id: string
}

export const useAuthStore = create<StoreState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user_id: '',
      token: '',
      storeLogin: (token: string) => {
        const decoded = decodeToken(token)

        if (decoded) {
          const currentTime = Date.now() / 1000
          if (decoded.exp < currentTime) {
            console.warn('Token has already expired.')
            set(() => ({
              isLoggedIn: false,
              user_id: '',
              token: '',
            }))
            localStorage.removeItem('token')
            localStorage.removeItem('user_id')
          } else {
            set({
              isLoggedIn: true,
              user_id: decoded.id,
              token,
            })
            localStorage.setItem('user_id', decoded.user_id)
          }
        }
      },
      storeLogout: () => {
        set({
          isLoggedIn: false,
          user_id: '',
          token: '',
        })
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
      },
    }),
    {
      name: 'auth-storage', // unique name
      storage: createJSONStorage(() => localStorage), //   (optional) by default, 'localStorage' is used
      // Optional: Define a version and migrate if necessary
      // version: 1,
      // migrate: (persistedState, version) => { return persistedState }
    }
  )
)
