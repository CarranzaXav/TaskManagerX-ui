import {useState,useEffect} from 'react'
import { useUpdateUserMutation, useDeleteUserMutation } from './usersApiSlice'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import {ROLES} from '../../config/roles'
import useAuth from '../../hooks/useAuth'

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,15}$/

const EditUserForm = ({user}) => {
// State and mutation hooks
    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()

    const [deleteUser,{
        isSuccess: isDelSuccess,
        isError: isDelError,
        error:delerror
    }] = useDeleteUserMutation()

    const navigate = useNavigate()

    const {isManager, isAdmin} = useAuth()

//Form State 
    const [username, setUsername] = useState(user.username)
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [email, setEmail] = useState(user?.email || "")
    // const [validEmail, setValidEmail] = useState(false)
    const [roles,setRoles] = useState(user.roles)
    const [active,setActive] = useState(user.active)

// Validations
    useEffect(() =>{
        setValidUsername(USER_REGEX.test(username))
    },[username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    },[password])

// Navigation after success
    useEffect(() => {
        console.log(isSuccess)
        if(isSuccess || isDelSuccess){
            setUsername('')
            setPassword('')
            setEmail('')
            setRoles([])
            navigate('/dash/users')
        }
    },[isSuccess, isDelSuccess, navigate])

// Handlers
    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    const onEmailChanged = e => setEmail(e.target.value)

    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setRoles(values)
    }    

    const onActiveChanged = () => setActive(prev => !prev)

    const onSaveUserClicked = async (e) => {
        if(password){
            await updateUser({id:user.id,username,password,email,roles,active})
        } else{
            await updateUser({id:user.id,username,email,roles,active})
        }
        console.log(email)
    }

    const onDeleteUserClicked = async () => {
        await deleteUser({id:user.id})
    }

    const options = Object.values(ROLES).map(role =>{
        return(
            <option 
            key={role}
            value={role}
            >{role}</option>
        )
    })

    let canSave
    if(password){
        canSave = [roles.length,validUsername,validPassword,email].every(Boolean) && !isLoading
    } else {
        canSave = [roles.length,validUsername,email].every(Boolean) && !isLoading
    }

    // CSS classes for form validation
    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    const validPwdClass = password && !validPassword ? 'form__input--incomplete' : ''
    const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''
    const validEmailClass = !email ? 'form__input--incomplete' : '' 
    
    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''


    const content = (
        <>
        <p className={errClass}>{errContent}</p>

        <form className='form__editUser' onSubmit={e => e.preventDefault()}>
        <h2>Edit User</h2>
        <label className='form__label' htmlFor="username">
            Username: <span className='nowrap'>[3-20 letters]</span>
        </label>
        <input 
            className={`form__input ${validUserClass}`}
            id='username'
            name='username'
            type="text"
            autoComplete='off'
            value={username}
            onChange = {onUsernameChanged}
        />

        <label className='form__label' htmlFor='password'>
            Password: <span className='nowrap'>[empty = no change]</span> <span className='nowrap'>[4-15 chars incl. !@#$%]</span>
        </label>
        <input 
            className={`form__input ${validPwdClass}`}  
            id="password" 
            name="password" 
            type="password" 
            value={password} 
            onChange={onPasswordChanged}
        />

        <label className='form__label' htmlFor='email'>
        Email:
        <input 
            className={`form__input ${validEmailClass}`}
            type="email" 
            id='email'
            name='email'
            value={email}
            onChange={onEmailChanged}
            />
        </label>

        <label className='form__label form__checkbox__activeUserStatus' htmlFor="user-active">
            ACTIVE:
            <input 
                className='form__checkbox'
                id='user-active'
                name='user-active' 
                type='checkbox'
                checked={active}
                onChange={onActiveChanged} 
            />
        </label>

        {(isManager || isAdmin) && 
        <div className="form__select__editUserAssignedRole">
        <label className='form__label' htmlFor="roles">
            ASSIGNED ROLES:</label>
        <select 
            id="roles" 
            name="roles" 
            className={`form__select form__select__editUser ${validRolesClass}`}
            multiple={true}
            size='3'
            value={roles}
            onChange={onRolesChanged}
        >
            {options}
        </select>
        </div>
        }

        <div className='form__title--row'>
            <div className='form__action-editUserButtons'>
            <button
                className='icon-button users__icon-button'
                title='Save'
                onClick={onSaveUserClicked}
                disabled={!canSave}
            >
                <FontAwesomeIcon icon={faSave} />
            </button>
            <button
                className='icon-button users__icon-button'
                title='Delete'
                onClick={onDeleteUserClicked}
            >
                <FontAwesomeIcon icon={faTrashCan} />
            </button>
            </div>
        </div>

        </form>
        </>
    )

  return content
}

export default EditUserForm