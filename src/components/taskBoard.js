import { Form } from "./form.js";
import { Input } from "./input";
import { Task } from "./task.js";
import { taskConfig } from "./formConfigs";
import { api } from "./API";

const getTaskForm = (onTaskCreated) =>
  new Form({
    title: "Add task",
    inputs: taskConfig.map((config) => new Input(config)),
    submitBtnText: "Add",
    onSubmit: async (data) => {
      const createdTask = await api.createTask(data);
      onTaskCreated(createdTask);
    },
  });

export class TaskBoard {
  constructor({ appContainer }) {
    this.appContainer = appContainer;
    this.tasksForm = getTaskForm(this.addTask.bind(this));
    this.tasksContainer = document.createElement("div");
    this.board = document.createElement("div");
  }

  renderLayout() {
    const formContainer = document.createElement("div");

    this.board.classList.add("board");
    formContainer.classList.add("task-form");
    this.tasksContainer.classList.add("task-cards");

    this.board.append(formContainer, this.tasksContainer);
    this.tasksForm.render(formContainer);

    this.appContainer.append(this.board);
  }

  addTask(taskData) {
    const task = new Task(taskData);

    task.renderCard(this.tasksContainer);
  }

  logout() {
    this.tasksContainer.innerHTML = "";
    this.board.innerHTML = "";
  }
}
