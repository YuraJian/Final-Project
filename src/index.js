import "./styles/style.css";
import { loginConfig } from "./components/formConfigs";
import { Input } from "./components/input";
import { Form } from "./components/form";
import { Auth } from "./components/auth";
import { api } from "./components/API";
import { TaskBoard } from "./components/taskBoard";

const appContainer = document.getElementById("app");
const formContainer = document.getElementById("container");

const onLoginSuccess = async () => {
  formContainer.innerHTML = "";

  const user = await api.getSelf();
  renderAppLayout(user);
};

const auth = new Auth({
  formContainer,
  onLoginSuccess,
});

export const taskBoard = new TaskBoard({
  appContainer,
});

const renderAppLayout = async (user) => {
  auth.user = user;
  auth.renderHeaderControls();
  taskBoard.renderLayout();

  const tasksList = await api.getAllTasks();

  tasksList.forEach((task) => taskBoard.addTask(task));
};

const init = async () => {
  const isLoggedIn = api.isLoggedIn();
  if (isLoggedIn) {
    const user = await api.autoLogin();
    renderAppLayout(user);
  } else {
    auth.renderAuthForm();
  }
};

init();
