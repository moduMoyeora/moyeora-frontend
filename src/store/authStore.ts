import { createJSONStorage, persist } from 'zustand/middleware'

import { create } from 'zustand'

interface StoreState {
  user_id: string | null
  isLoggedIn: boolean
  storeLogin: (id: string) => void
  storeLogout: () => void
}

export const getUserId = () => {
  return localStorage.getItem('user_id')
}
export const removeUserId = () => {
  localStorage.removeItem('user_id')
}
export const useAuthStore = create<StoreState>()(
  persist<StoreState>(
    (set) => ({
      user_id: null,
      isLoggedIn: false,
      storeLogin: (id: string) => {
        set({
          isLoggedIn: true,
          user_id: id,
        })
        localStorage.setItem('user_id', id)
      },
      storeLogout: () => {
        console.log('logout')
        set({
          isLoggedIn: false,
          user_id: null,
        })
        localStorage.removeItem('user_id')
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
