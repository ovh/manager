export default class NashaComponentsModalFormController {
  constructor() {
    this.submitting = false;
  }

  doSubmit() {
    this.submitting = true;
    this.submit();
  }
}
