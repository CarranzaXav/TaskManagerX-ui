import { useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePen,
  faUserGear,
  faUserPlus,
  faRightFromBracket,
  faFileCirclePlus,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import PulseLoader from "react-spinners/PulseLoader";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";

import "./componentsCSS/DashHeader.css";
import useAuth from "../hooks/useAuth";

const DASH_REGEX = /^\/dash(\/)?$/;
const TASKS_REGEX = /^\/dash\/tasks(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
  const { isManager, isAdmin } = useAuth();
  const [toggleMenuOpen, setToggleMenuOpen] = useState(false);

  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  const hover = () => {
    setIsHovered(true);
  };

  const onNewTaskClicked = () => {
    navigate("/dash/tasks/new");
  };
  const onNewUserClicked = () => {
    navigate("/dash/users/new");
  };
  const onTaskClicked = () => {
    navigate("/dash/tasks");
  };
  const onUsersClicked = () => {
    navigate("/dash/users");
  };

  let dashClass = null;
  if (
    !DASH_REGEX.test(pathname) &&
    !TASKS_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname)
  ) {
    dashClass = "dash-header__container--small";
  }

  let newTaskButton = null;
  if (TASKS_REGEX.test(pathname)) {
    newTaskButton = (
      <button
        className={`dash-header__iconButton ${isHovered ? "hovered" : ""}`}
        title="New Task"
        onClick={onNewTaskClicked}
        onMouseOver={hover}
      >
        <FontAwesomeIcon icon={faFileCirclePlus} />{" "}
      </button>
    );
  }

  let newUserButton = null;
  if (USERS_REGEX.test(pathname)) {
    newUserButton = (
      <button
        className={`dash-header__iconButton ${isHovered ? "hovered" : ""}`}
        title="Users"
        onClick={onNewUserClicked}
        onMouseOver={hover}
      >
        <FontAwesomeIcon icon={faUserPlus} />
      </button>
    );
  }

  let userButton = null;
  if (isManager || isAdmin) {
    if (!USERS_REGEX.test(pathname) && pathname.includes("/dash")) {
      userButton = (
        <button
          className={`dash-header__iconButton ${isHovered ? "hovered" : ""}`}
          title="Users"
          onClick={onUsersClicked}
          onMouseOver={hover}
        >
          <FontAwesomeIcon icon={faUserGear} />
        </button>
      );
    }
  }

  let tasksButton = null;
  if (!TASKS_REGEX.test(pathname) && pathname.includes("/dash")) {
    tasksButton = (
      <button
        className={`dash-header__iconButton ${isHovered ? "hovered" : ""}`}
        title="Tasks"
        onClick={onTaskClicked}
        onMouseOver={hover}
      >
        <FontAwesomeIcon icon={faFilePen} />
      </button>
    );
  }

  const logoutButton = (
    <button
      className={`dash-header__iconButton ${isHovered ? "hovered" : ""}`}
      title="Logout"
      onClick={sendLogout}
      onMouseOver={hover}
    >
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );

  const errClass = isError ? "errmsg" : "offscreen";
  const toggle = toggleMenuOpen ? "inline-flex" : "none";

  let buttonContent;
  if (isLoading) {
    buttonContent = (
      <p>
        Logging Out
        <PulseLoader color={"#FFF"} />
      </p>
    );
  } else {
    buttonContent = (
      <>
        {newTaskButton}
        {newUserButton}
        {tasksButton}
        {userButton}
        {logoutButton}
      </>
    );
  }

  const toggleMenu = () => {
    setToggleMenuOpen(!toggleMenuOpen);
  };

  const closeMenu = () => {
    setToggleMenuOpen(false);
  };

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <header className="dash-header">
        <Link className="dash-header__titleContainer" to="/dash">
          <h1 className="dash-header__title">Task Manager X</h1>
        </Link>

        <div
          className={`dash-header__container ${dashClass}`}
          onMouseLeave={closeMenu}
        >
          <nav className={`${toggle} dash-header__nav`}>{buttonContent}</nav>
          <button
            title="toggleMenu"
            className="dash-header__icon"
            onClick={toggleMenu}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </header>
    </>
  );

  return content;
};

export default DashHeader;
