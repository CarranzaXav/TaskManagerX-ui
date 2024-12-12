import { useGetUsersQuery } from "./usersApiSlice"
import User from "./User"
import PulseLoader from "react-spinners/PulseLoader"
import useTitle from "../../hooks/useTitle"

const UsersList = () => {
    useTitle('Task Manager X: Users List')

const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error
} = useGetUsersQuery('usersList', {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange:true
})

let content 

if(isLoading) content = <PulseLoader color={"#FFF"}/>

if(isError){
    content = <p className="errmsg">{error?.data?.message}</p>
}

if(isSuccess){
    const {ids} = users

    const listContent = ids?.length
    ? ids.map(userId => <User key={userId} userId={userId} />) : null

    content = (
        
        <div className="list list--users">   {/*table class=table table--users*/}
            <div className="lhead list__lhead"> {/*thead class=table__thead*/}
                <div className="list__row"> {/*tr */}

                    <div className="users__list__lh user__username">Username</div> {/*th table__th */}

                    <div className="users__list__lh user__roles">Roles</div>

                    <div className="users__list__lh user__edit">Edit</div>

                </div>
            </div>
            <div className="lbody"> {/*tbody */}
                {listContent}
            </div>
        </div>
    )
}

    return content
}

export default UsersList