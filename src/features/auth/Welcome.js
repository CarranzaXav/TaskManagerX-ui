import {Link} from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useTitle from '../../hooks/useTitle'
import addTaskIcon from '../../icons/addTask.svg'
import taskList from '../../icons/taskList.svg'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUser, faUserPlus} from "@fortawesome/free-solid-svg-icons"

const Welcome = () => {
    const { username, isManager, isAdmin} = useAuth()

     useTitle(`Task Manager X - ${username}`)

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', {dateStyle:'full'}).format(date)
    const time = new Intl.DateTimeFormat('en-US', {timeStyle:'short'}).format(date)

    const content = (
        <section className='welcome'>

        <h1>Welcome {username}</h1>

        <div className="welcome__date">
            <p className='welcome__date--date'>{today}</p>
            
            <p className="welcome__date--time">{time}</p>
        </div>
        <div className='welcome__links'>
            <div className='welcome__link'>
                <Link to="/dash/tasks">
            
                    <img src={taskList} alt="View Task List" 
                    className='welcome__taskListIcon'/>
                    <div className="welcome__links--title">
                        View Task
                     </div>
              </Link>
            </div>

            <div className='welcome__link'>
                <Link to='/dash/tasks/new'>
                    <img 
                    className='welcome__addTaskIcon'
                    src={addTaskIcon} alt="Add Task Icon" />
                    <div className="welcome__links--title">
                    Add New Task
                    </div>
                </Link>
            </div>

            {(isManager || isAdmin) && 
            <>
               <div className='welcome__link'>
                    <Link to="/dash/users">
                        <FontAwesomeIcon
                        icon={faUser}
                        className='welcome__userListIcon'/> 
                        <div className="welcome__links--title">
                            View User Setting
                        </div>
                    </Link>
                </div>
                
                <div className='welcome__link'>
                    <Link to='/dash/users/new'>
                        <FontAwesomeIcon icon={faUserPlus} className='welcome__newUserIcon'/>
                    <div className="welcome__links--title">
                            Add New User
                    </div>


                    </Link>
                </div>
             
            </>
            }

           
        </div>


        </section>
    )

    return content
}

export default Welcome