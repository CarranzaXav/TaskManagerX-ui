import { useState, useEffect } from "react";
import { useAddNewTaskMutation } from "./tasksApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { AREAS } from "../../config/areas";
import useTitle from "../../hooks/useTitle";
import useAuth from "../../hooks/useAuth";

// import "./tasksCSS/Task.css"
import "./tasksCSS/NewTaskForm.css";

const NewTaskForm = ({ users }) => {
  useTitle("Task Manager X: New Task Form");

  const { isAdmin, isManager } = useAuth();

  const [addNewTask, { isLoading, isSuccess, isError, error }] =
    useAddNewTaskMutation();

  const navigate = useNavigate();

  const [areas, setAreas] = useState(["Code-Maintanence"]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState(users?.[0]?.id || "");

  useEffect(() => {
    if (isSuccess) {
      setUserId("");
      setAreas([]);
      setText("");
      navigate("/dash/tasks");
    }
  }, [isSuccess, navigate]);

  const onTextChanged = (e) => setText(e.target.value);
  const onUserIdChanged = (e) => setUserId(e.target.value);

  const onAreasChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setAreas(values);
  };

  const canSave = [text, userId, areas.length].every(Boolean) && !isLoading;

  const onSaveTaskClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewTask({ user: userId, areas, text });
    }
  };

  const fields = Object.values(AREAS).map((area) => {
    return (
      <option key={area} value={area}>
        {area}
      </option>
    );
  });

  const options = users?.length
    ? users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.username}
        </option>
      ))
    : null;

  const errClass = isError ? "errmsg" : "offscreen";
  const validAreasClass = !Boolean(areas.length)
    ? "from__input--incomplete"
    : "";
  const validTextClass = !text ? "form__input--incomplete" : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="newTaskForm" onSubmit={onSaveTaskClicked}>
        <div className="newTaskForm__title-row">
          <h2 className="newTaskForm__title">New Task</h2>
          <div className="newTask__lineContainer">
            <div className="newTask__line"></div>
          </div>
        </div>

        <div className="newTaskForm__block">
          {isAdmin ? (
            <div className="newTaskForm__area__select__row">
              <label className="newTaskForm__label__area" htmlFor="areas">
                Assigned Area:
              </label>
              <select
                name="areas"
                id="areas"
                className={`newTaskForm__select newTaskForm__select ${validAreasClass}`}
                multiple={true}
                size="1"
                value={areas}
                onChange={onAreasChanged}
              >
                {fields}
              </select>
            </div>
          ) : (
            <div className="newTaskForm__area__select__row__empty"></div>
          )}

          <div className="newTaskForm__text__block">
            <label className="newTaskForm__label" htmlFor="text">
              Enter Task Here:
            </label>
            <textarea
              className={`newTaskForm__input form__input--text ${validTextClass}`}
              id="text"
              name="text"
              value={text}
              onChange={onTextChanged}
            />
          </div>

          {isManager && (
            <div className="newTaskForm__assign__block">
              <label
                className="newTaskForm__label__assign newTaskForm__checkbox-container"
                htmlFor="username"
              >
                Assigned To:
              </label>
              <select
                name="username"
                id="username"
                className="newTaskForm__select__assign"
                value={userId}
                onChange={onUserIdChanged}
              >
                {options}
              </select>
            </div>
          )}
        </div>

        <div className="newTaskFormBtnContainer">
          <button
            className="icon-button-newTaskForm"
            title="Save"
            disabled={!canSave}
          >
            <FontAwesomeIcon icon={faSave} />
          </button>
        </div>
      </form>
    </>
  );
  return content;
};

export default NewTaskForm;
