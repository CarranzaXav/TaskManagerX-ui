import { useState, useEffect } from "react"
import { useAddNewUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"
import {ROLES} from '../../config/roles'
import useTitle from "../../hooks/useTitle"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,15}/

const NewUserForm = () => {
    useTitle('Task Manager X: New User')

    const [addNewUser,{
        isLoading,
        isSuccess,
        isError,
        error}] = useAddNewUserMutation()

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [roles, setRoles] = useState(['Common'])

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    },[username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        if(isSuccess){
            setUsername('')
            setPassword('')
            setRoles([])
            navigate('/dash/users')
        }
    }, [isSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    const onEmailChanged = e => setEmail(e.target.value)

    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions, //HTML Collection
            (option) => option.value
        )
        setRoles(values)
    }

    const canSave = [roles.length, email.length, validUsername, validPassword].every(Boolean) && !isLoading

    const onSaveUserClicked = async(e) => {
        e.preventDefault()
        if(canSave){
            await addNewUser({username,email,password,roles})
        }
    }

    const options = Object.values(ROLES).map(role =>{
        return (
            <option
            key = {role}
            value = {role}
            >{role}</option>
        )
    })

    const errClass = isError ? 'errmsg' : 'offscreen'
    const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
    const validEmailClass = !email.length ? 'form__input--incomplete' : ''
    const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className='form__user' onSubmit={onSaveUserClicked}>
                <div className='form__title-row'>
                    <h2 className='form__title'>New User</h2>
                    <div className="new__task__line"></div>
                </div>
               
                <label className='form__label form__label__user' htmlFor="username">
                    Username: <span className="nowrap">[3-20 letters]</span>
                </label>
                <input 
                    className={`form__input ${validUserClass}`} 
                    id='username'
                    name='username'
                    type='text'
                    autoComplete='off'
                    value={username}
                    onChange={onUsernameChanged}
                />
                
                <label className='form__label form__label__user' htmlFor="email">
                    Email: <span className="nowrap">[Enter A Valid Email]</span>
                </label>
                <input 
                    className={`form__input ${validEmailClass}`} 
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='off'
                    value={email}
                    onChange={onEmailChanged}
                />

                <label className='form__label' htmlFor='password'>
                    Password: <span className='nowrap'>[4-12 chars incl. !@#$%]</span>
                </label>
                <input 
                    className={`form__input ${validPwdClass}`}
                    id= 'password'
                    name= 'password'
                    type='password'
                    value={password}
                    onChange={onPasswordChanged}
                />

                <label className='form__label' htmlFor="roles">
                    Assigned Roles: 
                </label>
                <select 
                    name='roles'
                    id='roles'
                    className={`form__select__user ${validRolesClass}`}
                    multiple= {true}
                    size='3'
                    value={roles}
                    onChange={onRolesChanged}
                >
                    {options}
                </select>

                 <div className='form__title-row'>
                    <div className='form__action-buttons'>
                        <button
                        className='icon-button users__icon-button'
                        title='Save'
                        disabled={!canSave}
                        >
                        <FontAwesomeIcon icon={faSave}/>
                        </button>
                    </div>
                </div>
            </form>
        </>
    )

    return content
}

export default NewUserForm