import { Routes,Route } from "react-router-dom"
import Layout from "./components/Layout"
import Public from "./components/Public"
import Login from "./features/auth/Login"
import DashLayout from "./components/DashLayout"
import Welcome from "./features/auth/Welcome"
import TasksList from "./features/tasks/TasksList"
import UsersList from "./features/users/UsersList"
import EditTask from "./features/tasks/EditTask"
import NewTask from "./features/tasks/NewTask"
import EditUser from './features/users/EditUser'
import NewUserForm from "./features/users/NewUserForm"
import Prefetch from "./features/auth/Prefetch"
import PersistLogin from "./features/auth/PersistLogin"
import RequireAuth from "./features/auth/RequireAuth"
import ForgotPwd from "./features/auth/ForgotPwd"
import ResetPwd from "./features/auth/ResetPwd"
import { ROLES } from "./config/roles"
import useTitle from "./hooks/useTitle"
import EmailSent from "./features/auth/EmailSent"

function App() {
useTitle('Task Manager X')

  return (
   <Routes>
    <Route path="/" element={<Layout/>}>
    {/* The index element specifies the default component to render when no sub-routes match within a parent route. */}
      <Route index element ={<Public/>}/> 

      <Route path="login" element={<Login/>}/>
      <Route path="forgotPwd" element={<ForgotPwd/>}></Route>
      <Route path="resetPwd/:token" element={<ResetPwd/>}></Route>
      <Route path="emailSent" element={<EmailSent/>}></Route>

      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]}/>}>
          <Route element={<Prefetch/>}>
          <Route path="dash" element={<DashLayout/>}>  

            <Route index element={<Welcome/>}/>

            <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]}/>}>
              <Route path='users'>
                <Route index element={<UsersList/>}/>
                <Route path=':id' element={<EditUser/>}/>
                <Route path='new' element={<NewUserForm/>} />
              </Route>
            </Route>

            <Route path='tasks'>
              <Route index element={<TasksList/>}/>
              <Route path=":id" element={<EditTask/>}/>
              <Route path='new' element={<NewTask/>}/>
            </Route>
            
          </Route> {/*end of dash*/}
          </Route>
        </Route>
      </Route>
      
    </Route>
   </Routes>
  );
}

export default App;
