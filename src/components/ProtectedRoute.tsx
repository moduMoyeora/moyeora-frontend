import { Navigate, Outlet } from 'react-router-dom'

import React from 'react'
import { useAuthStore } from '../store/authStore'

const ProtectedRoute: React.FC = () => {
  const { isLoggedIn } = useAuthStore()

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
