import { api } from "./API";

export class Task {
  constructor({
    name,
    description,
    timeTracked,
    isActive,
    isFinished,
    _id,
    createdAt,
  }) {
    this.name = name;
    this.description = description;
    this.timeTracked = timeTracked;
    this.isActive = isActive;
    this.isFinished = isFinished;
    this.createdAt = new Date(createdAt);

    this.id = _id;

    this.taskCard = document.createElement("div");
    this.deleteBtn = document.createElement("button");
    this.timerBtn = document.createElement("button");
    this.timeTrackedElement = document.createElement("span");
    this.markAsDoneBtn = document.createElement("button");
    this.timeTrackedIntervalId = null;
  }

  renderCard(container) {
    const titleElement = document.createElement("h3");
    const descriptionElement = document.createElement("p");
    const timeTracker = document.createElement("div");
    const dateElement = document.createElement("p");

    titleElement.classList.add("task-title");
    descriptionElement.classList.add("task-description");
    timeTracker.classList.add("time-tracker", "flex");
    dateElement.classList.add("task-date");

    this.taskCard.classList.add("task-card");
    this.deleteBtn.classList.add("task-delete-btn", "btn-default");
    this.timerBtn.classList.add("timer-btn", "timer-btn-play", "btn-default");
    this.markAsDoneBtn.classList.add("btn", "submit-btn", "task-card-btn");

    if (this.isFinished) {
      this.timerBtn.setAttribute("disabled", "");
      this.taskCard.classList.add("task-finished");
      this.markAsDoneBtn.innerText = "Restart";
    } else {
      this.markAsDoneBtn.innerText = "Mark as done";
    }

    titleElement.innerText = this.name;
    descriptionElement.innerText = this.description;

    dateElement.innerText = Task.getFormatDate(this.createdAt);
    this.timeTrackedElement.innerText = Task.getFormattedTimeTracked(
      this.timeTracked
    );

    this.deleteBtn.innerHTML = '<i class="fa-regular fa-circle-xmark"></i>';

    if (this.isActive) {
      this.startTracker();
      this.timerBtn.innerHTML = '<i class="fa-regular fa-circle-pause"></i>';
    } else if (this.taskCard.classList.contains("task-finished")) {
      this.stopTracker();
      this.timerBtn.innerHTML = '<i class="fa-regular fa-circle-play"></i>';
    } else {
      this.timerBtn.innerHTML = '<i class="fa-regular fa-circle-play"></i>';
    }

    timeTracker.append(this.timerBtn, this.timeTrackedElement);

    this.taskCard.append(
      titleElement,
      descriptionElement,
      timeTracker,
      dateElement,
      this.markAsDoneBtn,
      this.deleteBtn
    );

    container.prepend(this.taskCard);

    this.timerBtn.addEventListener("click", this.toggleTimeTracker);
    this.deleteBtn.addEventListener("click", this.removeTask);
    this.markAsDoneBtn.addEventListener("click", this.toggleTaskFinished);
  }

  removeTask = async () => {
    await api.deleteTask(this.id);
    this.taskCard.remove();
  };

  toggleTimeTracker = async () => {
    this.isActive = !this.isActive;

    await api.editTask(this.id, {
      isActive: this.isActive,
    });

    if (this.isActive) {
      this.startTracker();
    } else {
      this.stopTracker();
    }
  };

  toggleTaskFinished = async () => {
    this.isFinished = !this.isFinished;

    await api.editTask(this.id, { isFinished: this.isFinished });

    this.taskCard.classList.toggle("task-finished");

    if (this.isFinished) {
      this.timerBtn.setAttribute("disabled", "");
      this.markAsDoneBtn.innerText = "Restart";
      this.stopTracker();
    } else {
      this.timerBtn.removeAttribute("disabled");
      this.markAsDoneBtn.innerText = "Mark as done";
    }
  };

  startTracker() {
    this.timerBtn.innerHTML = '<i class="fa-regular fa-circle-pause"></i>';

    this.timeTrackedIntervalId = setInterval(() => {
      this.timeTracked += 1000;
      this.updateTracker();
    }, 1000);
  }

  stopTracker() {
    this.timerBtn.innerHTML = '<i class="fa-regular fa-circle-play"></i>';

    clearInterval(this.timeTrackedIntervalId);
  }

  updateTracker() {
    const formatted = Task.getFormattedTimeTracked(this.timeTracked);
    this.timeTrackedElement.innerText = formatted;
  }

  static getFormatDate(d) {
    const date = d.toLocaleDateString();
    const time = d.toLocaleTimeString();

    return `${date} ${time}`;
  }

  static addOptionalZero(value) {
    return value > 9 ? value : `0${value}`;
  }

  static getFormattedTimeTracked(timeTracked) {
    const timeTrackedSeconds = Math.floor(timeTracked / 1000);
    const hours = Math.floor(timeTrackedSeconds / 3600);
    const minutes = Math.floor((timeTrackedSeconds - hours * 3600) / 60);
    const seconds = timeTrackedSeconds - hours * 3600 - minutes * 60;

    return `${this.addOptionalZero(hours)}:${this.addOptionalZero(
      minutes
    )}:${this.addOptionalZero(seconds)}`;
  }
}
