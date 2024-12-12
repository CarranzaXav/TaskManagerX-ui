import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import { useGetUsersQuery } from "./usersApiSlice"
import { memo } from "react"

const User = ({ userId }) => {

    const { user } = useGetUsersQuery('usersList', {
        selectFromResult: ({data}) => ({
            user: data?.entities[userId]
        })
    })

    const navigate = useNavigate()

    if(user){
        const handleEdit = () => navigate(`/dash/users/${userId}`)

        const userRolesString = user.roles.toString().replaceAll(',',',')

        const cellStatus = user.active ? '' : 'list__cell--inactive'

        return (
            <div className="list__row">
                <div className={`users__list__cell ${cellStatus}`}>
                    {user.username}
                </div>
                <div className={` users__list__cell ${cellStatus}users__list--roles`}>
                    {userRolesString}
                </div>
                <div className={` ${cellStatus} users__edit--button`}>
                    <button
                    className="users__list__button"
                    onClick={handleEdit}
                    >
                    <FontAwesomeIcon icon={faPenToSquare}/>
                    </button>
                </div>
            </div>
        )
    } else return null
}

const memoizedUser = memo(User)

export default memoizedUser