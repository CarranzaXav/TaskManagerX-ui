import { useState, useEffect } from "react"
import { useUpdateTaskMutation, useDeleteTaskMutation } from "./tasksApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import {AREAS} from '../../config/areas'
import useAuth from '../../hooks/useAuth'

const EditTaskForm = ({ task, users }) => {

    const {isManager, isAdmin} = useAuth()

    const [updateTask, {
        isLoading,
        isSuccess,
        isError,
        error
    }] =useUpdateTaskMutation()

    const [deleteTask, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteTaskMutation()

    const navigate = useNavigate()

    const [userId, setUserId] = useState(task.user)
    const [areas, setAreas] = useState(task.areas)
    const [text, setText] = useState(task.text)
    const [completed, setCompleted] = useState(task.completed)

    useEffect(() => {

        if (isSuccess || isDelSuccess){
            setAreas([])
            setText('')
            setUserId('')
            navigate('/dash/tasks')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const onTextChanged = e => setText(e.target.value)
    const onCompletedChanged = e => setCompleted(prev => !prev)
    const onUserIdChanged = e => setUserId(e.target.value)

    const onAreasChanged = e =>{
        const values = Array.from(e.target.selectedOptions,
        (option) => option.value)
        setAreas(values)
    }

    const canSave = [areas,text,userId].every(Boolean) && !isLoading

    const onSaveTaskClicked = async (e) => {
        if(canSave) {
            await updateTask({id: task.id, user: userId, areas, text, completed})
        }
    }

    const onDeleteTaskClicked = async () => {
        await deleteTask({id: task.id})
    }

    const created = new Date(task.createdAt).toLocaleString('en-US',{day: 'numeric', month:'long', year : 'numeric', hour:'numeric', minute: 'numeric'})
    const updated = new Date(task.createdAt).toLocaleString('en-US',{day: 'numeric', month:'long', year : 'numeric', hour:'numeric', minute: 'numeric'})

    const options = users.map(user => {
        return (
            <option value={user.id}
            key={user.id}>{user.username}</option>
        )
    })

      const fields = Object.values(AREAS).map(area => {
        return (
            <option
            key={area}
            value={area}>
            {area}</option>
        )
    })

    const errClass = (isError || isDelError) ? 'errmsg' : 'offscreen'
    const validAreasClass = !areas ? 'form__input--incomplete' : ''
    const validTextClass = !text ? 'form__input--incomplete' : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    let deleteButton = null
    if(isManager || isAdmin){
        deleteButton = (
            <button 
                className=" icon-button-edit"
                title="Delete"
                onClick={onDeleteTaskClicked}
            >
            <FontAwesomeIcon icon={faTrashCan} />
            </button>
        )
    }

    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form__edit" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit Task #{task.ticket}</h2>
                </div>

              {(isAdmin) &&  
              <div className="form__field__select">
                <label htmlFor="task-areas" className="form__label-edit">Area: </label> 
                    <select name="areas" id="areas" className={`form__select form__select__editTask ${validAreasClass}`}
                    multiple={true}
                    size='3'
                    value={areas}
                    onChange={onAreasChanged}
                    >
                        {fields}
                    </select>
              </div>
                }

                <label className='form__label-edit' htmlFor="task-text">Text:</label>
                <textarea 
                    name="text" 
                    id="task-text"  
                    className={`form__input form__input__editTask form__input--text ${validTextClass}`}
                    value={text}
                    onChange={onTextChanged}
                />

                <div className='form__row-edit'>
                    <div className='form__divider'>
                        <label 
                            htmlFor="task-completed" 
                            className="form__label form__checkbox-container">Task Completed: 
                        <input 
                        className='form__checkbox' 
                        id='task-completed'
                        name='completed'
                        type="checkbox"
                        checked={completed}
                        onChange={onCompletedChanged} 
                        />
                        </label>

                        <label 
                            htmlFor="task-username" 
                            className="form__label form__checkbox-container"
                        > Assigned  To: </label>
                        <select 
                        name="username" 
                        id="task-username" 
                        className="form__editTask__username task-username"
                        value={userId}
                        onChange={onUserIdChanged}
                        >{options}</select>
                    </div>
                    <div className="form__divider form__status">
                        <p className="form__created">Created: <br />{created}</p>
                        <p className="form__updated">Updated: <br /> {updated}/</p>
                    </div>
                </div>
                <div className="form__title-row-edit">
                    <div className=" icon-button-edit">
                        <button
                            className=" icon-button-edit"
                            title='Save'
                            onClick={onSaveTaskClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave}/>
                        </button>
                    </div>
                        {deleteButton}
                </div>
            </form>
        </>
    )

  return content
}

export default EditTaskForm