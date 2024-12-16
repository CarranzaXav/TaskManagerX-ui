import { useState} from "react"
import { useGetTasksQuery } from "./tasksApiSlice"
import Task from "./Task"
import useAuth from '../../hooks/useAuth'
import PulseLoader from "react-spinners/PulseLoader"
import useTitle from "../../hooks/useTitle"
import { AREAS } from "../../config/areas"

const TasksList = () => {
    useTitle('Task Manager X: Task List')

    const {username, isManager, isAdmin} = useAuth()
    const [selectedArea, setSelectedArea] = useState('All')

    const {
    data: tasks,
    isLoading,
    isSuccess,
    isError,
    error
    } = useGetTasksQuery('tasksList', {
        pollingInterval: 15000,
        refetchOnFocus:true,
        refetchOnMountOrArgChange: true
    })

const handleAreaChange = (e) => setSelectedArea(e.target.value)

let content 

if(isLoading) content = <PulseLoader className="loader" color={'#FFF'}/>

if(isError){
    content = <p className="errmsg">{error?.data?.message}</p>
}

if(isSuccess){
    const {ids, entities} = tasks

    let filteredIds
    if (isManager || isAdmin){
        filteredIds = [...ids]
    } else {
        filteredIds = ids.filter(taskId => entities[taskId].username === username)
    }
    if(selectedArea !== 'All') {
        filteredIds = filteredIds.filter(taskId => {
            const taskArea = entities[taskId].areas || []
            return taskArea.includes(selectedArea)})
    }

    const listContent = ids?.length
    ? filteredIds.map(taskId => <Task key={taskId} taskId={taskId} />) : null

    content = (
        <div className="list__container">

         {(isAdmin) &&
            <div className="list__filter">
                <label 
                htmlFor="areaFilter" 
                className=""
                >Filter by Area: </label>
                <select
                    className="list__filter--dropdown"
                    name="areaFilter" id="areaFilter" 
                    value={selectedArea} onChange={handleAreaChange}
                 >
                    <option value="All">All Areas</option>
                    {Object.values(AREAS).map(area => (
                        <option  key={area} value={area}>{area}</option>
                    ))}

                </select>
            </div>
        }

        <div className="list list--tasks">
       
            <div className="lhead list__lhead"> 
                <div className="list__row">
                <div className="list__lh task__status">Status</div>
                
                  <div className="list__lh task__created">Created</div>

                  <div className="list__lh task__username">User</div>
                                    

                   <div className="list__lh task__areas task__areas--tablet">Area</div>

                  <div className="list__lh task__taskname task__taskname--header--mobile">Task Info.</div>
                 
                  <div className="list__lh task__updated"> Updated </div>

                  <div className="list__lh task__edit task__edit--mobile">Edit</div>
                </div>

            </div>
            <div className="lbody">
                {listContent}
            </div>
        </div>
        </div>
    )
}

    return content
}

export default TasksList