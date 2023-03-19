export class Form {
  constructor(options) {
    const { inputs } = options;
    this.submitBtn = document.createElement("button");
    this.inputs = inputs;
    this.form = document.createElement("form");
    this.createForm(options);
    this.submitBtnContainer = document.createElement("div");

    this.form.classList.add("login-register-form");
  }

  static getFormValues(inputs) {
    return inputs.reduce((values, input) => {
      values[input.name] = input.value;
      return values;
    }, {});
  }

  createForm({ onSubmit, submitBtnText, title: titleText }) {
    const title = document.createElement("h3");
    const submitBtnContainer = document.createElement("div");

    title.innerText = titleText;
    submitBtnContainer.classList.add("submit-btn-container", "flex");
    this.submitBtn.type = "submit";
    this.submitBtn.innerText = submitBtnText;

    title.classList.add("login-title");
    this.submitBtn.classList.add("btn", "submit-btn");

    this.form.addEventListener("submit", async (event) => {
      event.preventDefault();

      this.formValues = Form.getFormValues(this.inputs);

      this.submitBtn.setAttribute("disabled", "");

      try {
        await onSubmit(this.formValues, event);
      } catch (err) {
        console.log("err", err.data);
        err.data.details.forEach(({ path, message }) => {
          const erroredInput = this.inputs.find((input) => {
            return input.name === path[0];
          });

          erroredInput.updateErrorMessage(message);
        });
      }

      this.submitBtn.removeAttribute("disabled");
    });

    this.form.append(title);

    this.inputs.forEach((input) => {
      input.render(this.form);
    });

    submitBtnContainer.append(this.submitBtn);
    this.form.append(submitBtnContainer);
  }

  render(container) {
    container.append(this.form);
  }
}
