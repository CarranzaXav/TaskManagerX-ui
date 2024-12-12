import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import Open from '../../icons/Open.svg'
import Completed from '../../icons/Complete.svg'
import { useNavigate } from "react-router-dom"
import { useGetTasksQuery, useUpdateTaskMutation } from "./tasksApiSlice"
import { memo } from 'react'

const Task = ({ taskId }) => {


    const { task } = useGetTasksQuery('tasksList', {
        selectFromResult: ({ data }) => ({
            task: data?.entities[taskId]
        }),
    })

    const [updateTask] = useUpdateTaskMutation()
    const navigate = useNavigate()

    const truncate = (str, n) => {
        return str?.length > n ? str.substr(0, n - 1) + "..." : str;
    }


    // const taskName = useMemo(() => (
    //     <div
    //         className={`
    //             list__cell 
    //             task__taskname
    //             task__taskname--mobile

    //             ${task.completed ? 'task__taskname--completed' : 'task__taskname--open'}`}
    //     >
    // { truncate(task.text, 60) }
    //     </div >
    // ), [task.completed, task.text]);

    const handleToggleCompleted = async () => {
        if (task) {
            try {
                await updateTask({
                    id: task.id,
                    user: task.user,
                    areas: task.areas,
                    text: task.text,
                    completed: !task.completed
                }).unwrap()
            } catch (err) {
                console.error("Failed to update the task status")
            }
        }
    }

    if (task) {
        const isCompleted = task.completed
        const taskClassName = isCompleted
            ? 'task__taskname--completed task__taskname--mobile'
            : 'task__taskname--open task__taskname--mobile'

        const statusClassName = isCompleted
            ? 'task__status__icon--completed'
            : 'task__status__icon--open'
        const created = new Date(task.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'short' })

        const updated = new Date(task.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'short' })

        const handleEdit = () => navigate(`/dash/tasks/${taskId}`)

        return (
            <div className="list__row ">
                <div className='list__cell task__status--info' onClick={handleToggleCompleted}>
                    {task.completed
                        ? <div className="task__status--container">
                            <div className="task__status--completed">
                                Completed
                            </div>
                            <div className={`task__status__icon ${statusClassName}`} >
                                <   img className="task__status__icon--img" src={Completed} alt="Task Completed" />
                            </div>
                        </div>
                        : <div className="task__status--container" >
                            <div className="task__status--open">
                                Open
                            </div>
                            <div className={`task__status__icon ${statusClassName}`} >
                                <img className="task__status__icon--img" src={Open} alt="Task Open" />
                            </div>
                        </div>
                    }
                </div>

                <div className="list__cell task__created">{created}</div>

                <div className='list__cell task__username'>
                    {task.username} {/*May be user */}
                </div>


                <div className='list__cell task__areas__info task__areas__info--tablet'>
                    {task.areas}
                </div>

                <div className={`list__cell task__taskname ${taskClassName}`}>
                    {truncate(task.text, 40)}
                </div>

                <div className="list__cell task__updated">{updated}</div>
                {/* {taskName} */}
                {/* 
                {task.completed 
                    ? <div 
                className='list__cell
                 task__taskname task__taskname--completedtask__taskname--mobile'
                 >
                    {truncate(task.text, 50)}
                </div>
                    : <div 
                className='list__cell task__taskname 
                task__taskname--open
                task__taskname--mobile'
                >
                    {truncate(task.text, 50)}
                </div>
                } */}
                {/* <div 
                className='list__cell task__taskname task__taskname--mobile'>
                    {truncate(task.text, 50)}
                </div> */}

                {/* <div
                    className={`list__cell task__taskname
                    task__taskname--mobile ${task.completed ? 'task__taskname--completed' : 'task__taskname--open'}`}
                >
                {truncate(task.text, 50)}                
                </div> */}


                <div className='list__cell icon-button--mobile'>
                    <button
                        className="icon-button list__button"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon
                            style={{ fontSize: 2 + "em" }}
                            className="icon--button-img-mobile" icon={faPenToSquare} />
                    </button>
                </div>
            </div>
        )
    } else return null
}

const memoizedTask = memo(Task)

// const memoizedTask = memo( Task, (prevProps, nextProps) => {
//     return prevProps.taskId === nextProps.taskId;
// })

export default memoizedTask