import { useState, useEffect} from 'react'
import { useAddNewTaskMutation } from './tasksApiSlice'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { AREAS } from '../../config/areas'
import useTitle from '../../hooks/useTitle'
import useAuth from '../../hooks/useAuth'

const NewTaskForm = ({ users }) => {
    useTitle('Task Manager X: New Task Form')

     const {isAdmin, isManager} = useAuth()


    const [addNewTask, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewTaskMutation()

    const navigate = useNavigate()

    const [areas, setAreas] = useState(['Code-Maintanence'])
    const [text, setText] = useState('')
    const [userId, setUserId] = useState(users?.[0]?.id || '')

    useEffect(() =>{
        if(isSuccess){
            setUserId('')
            setAreas([])
            setText('')
            navigate('/dash/tasks')
        }
    }, [isSuccess, navigate])

    const onTextChanged = e => setText(e.target.value)
    const onUserIdChanged = e => setUserId(e.target.value)

    const onAreasChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setAreas(values)
    }

    const canSave = [text, userId, areas.length].every(Boolean) &&  !isLoading

    const onSaveTaskClicked = async(e) => {
        e.preventDefault()
        if(canSave){
            await addNewTask({user: userId, areas, text})
        }
    }

    const fields = Object.values(AREAS).map(area => {
        return (
            <option
            key={area}
            value={area}>
            {area}</option>
        )
    })

    const options = users?.length ? users.map(user => (
            <option
                key={user.id}
                value={user.id}
            >
            {user.username}
            </option>    
    )) : null

    const errClass = isError ? 'errmsg' : 'offscreen'
    const validAreasClass = !Boolean(areas.length) ? 'from__input--incomplete' : ''
    const validTextClass = !text ? "form__input--incomplete" : ''

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className='form' onSubmit={onSaveTaskClicked}>
                <div className='form__title-row'>
                    <h2 className='form__title'>New Task</h2>
                    <div className="new__task__line"></div>
                </div>
                {(isAdmin) &&
                    <div className='form__area__select__row'>
                    <label className='form__label__area' htmlFor='areas'>
                        Assigned Area:
                    </label>
                    <select 
                    name="areas" 
                    id="areas" 
                    className={`form__select form__select__task ${validAreasClass}`}
                    multiple={true}
                    size='1'
                    value={areas}
                    onChange={onAreasChanged}
                    >
                        {fields}
                    </select>
                    </div>
                }

                <div className='form__text__block'>
                    <label className='form__label form__label__task' htmlFor="text">
                        Enter Task Here:
                    </label>
                    <textarea
                        className={`form__input form__input--task form__input--text ${validTextClass}`}
                        id='text'
                        name='text'
                        value={text}
                        onChange={onTextChanged}
                    />
                </div>

            {(isManager) &&   <div className='form__assign__block'>
                    <label className='form__label form__label__assign form__checkbox-container' htmlFor="username">
                    Assigned To:
                    </label>
                    <select 
                        name="username" 
                        id="username"
                        className='form__select form__select__task'
                        value={userId}
                        onChange={onUserIdChanged}
                    >
                        {options}
                    </select>
                </div>
                }
                
                <div className=''>
                    <button
                        className='icon-button icon-button-taskSave'
                        title='Save'
                        disabled={!canSave}
                    >
                    <FontAwesomeIcon icon={faSave}/>
                    </button>
                </div>
            </form>
        </>
    )
  return content
}

export default NewTaskForm
