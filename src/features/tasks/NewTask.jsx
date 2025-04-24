import { useGetUsersQuery } from "../users/usersApiSlice";
import NewTaskForm from "./NewTaskForm";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";

const NewTask = () => {
  useTitle("Task Manager X: New Task");

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!users?.length) return <PulseLoader className="loader" color={"#FFF"} />;

  const content = <NewTaskForm users={users} />;

  return content;
};

export default NewTask;
