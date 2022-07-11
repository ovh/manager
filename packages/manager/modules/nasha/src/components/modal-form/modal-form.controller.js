export default class NashaComponentsModalFormController {
  constructor() {
    this.submitting = false;
  }

  onSubmit() {
    this.submitting = true;
    return this.submit();
  }
}
