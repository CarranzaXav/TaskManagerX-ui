import { useLocation, Navigate, Outlet } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const RequireAuth = ({ allowedRoles = [] }) => {
    const location = useLocation()
    const { roles } = useAuth()

    // Ensure roles is always an array
    const hasRequiredRole = Array.isArray(roles) &&
        roles.some(role => allowedRoles.includes(role))

    const content = (
        hasRequiredRole
        ? < Outlet />
        : <Navigate to='/login' state={{ from: location }} replace />
    )

  return content
}

export default RequireAuth