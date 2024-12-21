import { createJSONStorage, persist } from 'zustand/middleware'

import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'

interface StoreState {
  token: string | null
  user_id: string | null
  isLoggedIn: boolean
  storeLogin: (token: string) => void
  storeLogout: () => void
}

interface JwtPayload {
  id: string
  exp: number
}

function decodeToken(token: string): JwtPayload {
  try {
    const decoded: any = jwtDecode(token)
    return decoded
  } catch (error) {
    console.error('JWT 디코딩 오류:', error)
    return {} as JwtPayload
  }
}

export const getToken = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    console.log('토큰이 존재하지 않습니다.')
    return null
  }
  return token
}

export const setToken = (token: string) => localStorage.setItem('token', token)

export const removeToken = () => {
  if (localStorage.getItem('token')) {
    localStorage.removeItem('token')
  } else {
    console.log('토큰이 존재하지 않습니다.')
    return null
  }
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
  persist<StoreState>(
    (set) => ({
      token: null,
      user_id: null,
      isLoggedIn: false,
      storeLogin: (token: string) => {
        const decoded = decodeToken(token)
        if (decoded) {
          const currentTime = Date.now() / 1000
          if (decoded.exp < currentTime) {
            console.warn('Token has already expired.')
            set({
              isLoggedIn: false,
              user_id: null,
              token: null,
            })
            localStorage.removeItem('token')
            localStorage.removeItem('user_id')
          } else {
            console.log('Token is valid.')
            localStorage.setItem('token', token)
            localStorage.setItem('user_id', decoded.id)
            set({
              isLoggedIn: true,
              user_id: decoded.id,
              token,
            })
          }
        }
      },
      storeLogout: () => {
        set({
          isLoggedIn: false,
          user_id: null,
          token: null,
        })
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
      },
    }),
    {
      name: 'auth-storage', // unique name
      storage: createJSONStorage(() => localStorage),
    }
  )
)
