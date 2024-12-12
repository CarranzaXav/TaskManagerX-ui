import {useSelector} from 'react-redux'
import { selectCurrentToken } from '../features/auth/authSlice'
import {jwtDecode} from 'jwt-decode'

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isManager = false
    let isAdmin = false
    let status = 'Common'
    let roles = []

    if (token) {
      try {
        const decoded = jwtDecode(token)
        const { username, roles:userRoles } = decoded.UserInfo || {}

        if(userRoles) {
          roles = userRoles
          isManager = roles.includes('Manager')
          isAdmin = roles.includes('Admin')

          if(isManager) status = 'Manager'
          if(isAdmin) status = 'Admin'

          // console.log('useAuth - Decoded Roles: ', roles)
          return {username, roles, status, isManager, isAdmin}
        }
      }
       catch (err) {
          console.error('Failed to decode token', err)
        }
    }
    

  return { username: '', roles:[], isManager, isAdmin, status }
}

export default useAuth