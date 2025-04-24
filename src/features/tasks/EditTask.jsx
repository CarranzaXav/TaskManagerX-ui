import { useParams } from "react-router-dom";
import { useGetTasksQuery } from "./tasksApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import EditTaskForm from "./EditTaskForm";
import useTitle from "../../hooks/useTitle";
import useAuth from "../../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";

const EditTask = () => {
  useTitle("Task Manager X: Edit Task");
  const { id } = useParams();

  const { username, isManager, isAdmin } = useAuth();

  const { task } = useGetTasksQuery("tasksList", {
    selectFromResult: ({ data }) => ({
      task: data?.entities[id],
    }),
  });

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!task || !users?.length)
    return <PulseLoader className="loader" color={"#FFF"} />;

  if (!isManager && !isAdmin) {
    if (task.username !== username) {
      return <p className="errmsg">No access</p>;
    }
  }

  const content = <EditTaskForm task={task} users={users} />;

  return content;
};

export default EditTask;
