import { useGetUsersQuery } from "./usersApiSlice";
import User from "./User";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";

import "./usersCSS/UsersList.css";

const UsersList = () => {
  useTitle("Task Manager X: Users List");

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <PulseLoader className="loader" color={"#FFF"} />;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = users;

    const listContent = ids?.length
      ? ids.map((userId) => <User key={userId} userId={userId} />)
      : null;

    content = (
      <div className="usersList">
        <div className="usersList__lhead">
          <div className="usersList__row">
            <div className="usersList__lh">Username</div>

            <div className="usersList__lh user__roles">Roles</div>

            <div className="usersList__lh user__edit">Edit</div>
          </div>
        </div>
        <div className="usersListBody">{listContent}</div>
      </div>
    );
  }

  return content;
};

export default UsersList;
