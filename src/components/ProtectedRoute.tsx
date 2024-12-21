import { Navigate, Outlet } from 'react-router-dom'

import React from 'react'
import { useAuthStore } from '../store/authStore'

const ProtectedRoute: React.FC = () => {
  const { isLoggedIn } = useAuthStore()

  if (!isLoggedIn) {
    alert('로그인이 필요한 페이지입니다.')
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
