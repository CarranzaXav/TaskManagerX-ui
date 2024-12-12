import {Outlet} from 'react-router-dom'


const Layout = () => {
    // <Outlet/> renders the matched child route component. It's used in parent routes to display nested routes' components.
  return <Outlet/>
}

export default Layout