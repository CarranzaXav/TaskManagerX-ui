import { useState, useEffect } from "react";
import { useUpdateTaskMutation, useDeleteTaskMutation } from "./tasksApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { AREAS } from "../../config/areas";
import useAuth from "../../hooks/useAuth";

// import './tasksCSS/Task.css'
import "./tasksCSS/EditTaskForm.css";

const EditTaskForm = ({ task, users }) => {
  const { isManager, isAdmin } = useAuth();

  const [updateTask, { isLoading, isSuccess, isError, error }] =
    useUpdateTaskMutation();

  const [
    deleteTask,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteTaskMutation();

  const navigate = useNavigate();

  const [userId, setUserId] = useState(task.user);
  const [areas, setAreas] = useState(task.areas);
  const [text, setText] = useState(task.text);
  const [completed, setCompleted] = useState(task.completed);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setAreas([]);
      setText("");
      setUserId("");
      navigate("/dash/tasks");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onTextChanged = (e) => setText(e.target.value);
  const onCompletedChanged = (e) => setCompleted((prev) => !prev);
  const onUserIdChanged = (e) => setUserId(e.target.value);

  const onAreasChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setAreas(values);
  };

  const canSave = [areas, text, userId].every(Boolean) && !isLoading;

  const onSaveTaskClicked = async (e) => {
    if (canSave) {
      await updateTask({ id: task.id, user: userId, areas, text, completed });
    }
  };

  const onDeleteTaskClicked = async () => {
    await deleteTask({ id: task.id });
  };

  const created = new Date(task.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  const updated = new Date(task.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  const options = users.map((user) => {
    return (
      <option value={user.id} key={user.id}>
        {user.username}
      </option>
    );
  });

  const fields = Object.values(AREAS).map((area) => {
    return (
      <option key={area} value={area}>
        {area}
      </option>
    );
  });

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validAreasClass = !areas ? "form__input--incomplete" : "";
  const validTextClass = !text ? "form__input--incomplete" : "";

  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  let deleteButton = null;
  if (isManager || isAdmin) {
    deleteButton = (
      <button
        className=" taskIcon-deleteButton"
        title="Delete"
        onClick={onDeleteTaskClicked}
      >
        <FontAwesomeIcon icon={faTrashCan} className="taskIcon-deleteBtn" />
      </button>
    );
  }

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="editTaskForm" onSubmit={(e) => e.preventDefault()}>
        <div className="editTaskForm__title-row">
          <h2>Edit Task #{task.ticket}</h2>
          {deleteButton}
        </div>

        {isAdmin && (
          <div className="editTaskForm__field__select">
            <label htmlFor="task-areas" className="editTaskForm__label">
              Area:{" "}
            </label>
            <select
              name="areas"
              id="areas"
              className={`editTaskForm__select ${validAreasClass}`}
              multiple={true}
              size="3"
              value={areas}
              onChange={onAreasChanged}
            >
              {fields}
            </select>
          </div>
        )}
        <div className="editTaskForm__editBlock">
          <label className="editTaskForm__label" htmlFor="task-text">
            Text:
          </label>
          <textarea
            name="text"
            id="task-text"
            className={`editTaskForm__input form__input--text ${validTextClass}`}
            value={text}
            onChange={onTextChanged}
          />
        </div>

<div className="editTaskForm__assign">
            <label
              htmlFor="task-username"
              className="editTaskForm__assignTo"
            >
              {" "}
              Assigned To:{" "}
            </label>
            <div className="editTaskForm__usernameBlk">
            <select
              name="username"
              id="task-username"
              className="editTaskForm__username"
              value={userId}
              onChange={onUserIdChanged}
            >
              {options}
            </select>
            </div>
          </div>

        <div className="editTaskForm__bottomRow">
          <div className="editTaskForm__completeBlock">
          <label
            htmlFor="task-completed"
            className="editTaskForm__completeLabel"
          >
            Task Completed:
          </label>
          <div className="editTaskForm__checkbox-container">
          <input
            className="taskForm__checkbox"
            id="task-completed"
            name="completed"
            type="checkbox"
            checked={completed}
            onChange={onCompletedChanged}
          />
          </div>
        </div>

          <div className=" taskIcon-buttonSaveContainer">
            <button
              className=" taskIcon-saveButton"
              title="Save"
              onClick={onSaveTaskClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} className="taskIcon-saveBtn" />
            </button>
          </div>
        </div>

        <div className="editTaskForm__title-row-edit"></div>
      </form>

      <div className="editTaskForm__timeBlock">
        <div className="editTaskForm__status">
          <p className="form__created">
            Created: <br />
            {created}
          </p>
          <p className="form__updated">
            Updated: <br /> {updated}
          </p>
        </div>
      </div>
    </>
  );

  return content;
};

export default EditTaskForm;
