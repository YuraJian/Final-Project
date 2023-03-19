import { api } from "./API";
import { Input } from "./input";
import { Form } from "./form";
import { loginConfig, registerConfig } from "./formConfigs";
import { taskBoard } from "../index.js";

const getLoginForm = (onSuccess) =>
  new Form({
    title: "Login",
    inputs: loginConfig.map((config) => new Input(config)),
    submitBtnText: "Submit",
    onSubmit: async (data) => {
      await api.login(data);
      onSuccess();
    },
  });

const getRegisterForm = (onSuccess) =>
  new Form({
    title: "Register",
    inputs: registerConfig.map((config) => new Input(config)),
    submitBtnText: "Submit",
    onSubmit: async (data) => {
      await api.register(data);
      onSuccess();
    },
  });

export class Auth {
  constructor({ formContainer, onLoginSuccess }) {
    this.formContainer = formContainer;

    this.formWrapper = document.createElement("div");
    this.switchBtn = document.createElement("button");
    this.logoutBtn = document.createElement("button");
    this.avatar = document.createElement("div");
    this.avatarLetter = document.createElement("span");

    this.form = null;
    this.user = null;
    this.isLogin = true;

    this.loginForm = getLoginForm(onLoginSuccess);
    this.registerForm = getRegisterForm(this.switchForms.bind(this));

    this.createFormWrapper();
    this.createHeaderControls();
  }

  createFormWrapper() {
    this.formWrapper.classList.add("auth-form");
    this.switchBtn.classList.add("btn", "text-btn", "register-btn");
    this.switchBtn.innerText = "Register";
    this.formWrapper.prepend(this.switchBtn);

    this.switchBtn.addEventListener("click", () => {
      this.switchForms();
    });
  }

  createHeaderControls() {
    this.logoutBtn.classList.add("btn", "text-btn");
    this.logoutBtn.innerText = "Logout";
    this.avatar.classList.add("header-content__logout-avatar", "flex");

    this.logoutBtn.addEventListener("click", () => {
      this.logout();
      api.logout();
      taskBoard.logout();
    });
  }

  renderHeaderControls() {
    const controlsContainer = document.getElementById("header-controls");
    this.avatarLetter.innerText = this.user.name[0];
    this.avatarLetter.style.textTransform = "uppercase";

    this.avatar.classList.add("header-content__logout-avatar", "flex");

    this.avatar.append(this.avatarLetter);
    controlsContainer.append(this.logoutBtn, this.avatar);
  }

  renderLoginForm() {}

  renderRegisterForm() {}

  renderAuthForm() {
    if (this.form) {
      this.form.form.remove();
    }

    if (this.isLogin) {
      this.form = this.loginForm;
    } else {
      this.form = this.registerForm;
    }

    this.form.render(this.formWrapper);
    this.formContainer.append(this.formWrapper);
  }

  switchForms() {
    this.isLogin = !this.isLogin;

    if (this.isLogin) {
      this.switchBtn.innerText = "Register";
    } else {
      this.switchBtn.innerText = "Login";
    }

    this.renderAuthForm();
  }

  logout() {
    this.logoutBtn.remove();
    this.avatar.remove();
    this.formContainer.innerHTML = "";
    this.isLogin = true;

    this.renderAuthForm();
  }
}
