import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Redirige a login si el usuario no está identificado
function ProtectedRoute({ children }) {
  const { token } = useAuth()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute