import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../../app/store'

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default RequireAuth
