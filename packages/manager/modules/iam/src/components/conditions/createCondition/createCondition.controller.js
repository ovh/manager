export default class IAMCreateConditionController {
  $onInit() {
    this.closeModal();
  }

  openModal() {
    this.modalOpen = true;
  }

  onConfirm = (condition) => {
    this.conditions.push(condition);
    this.closeModal();
  };

  closeModal() {
    this.modalOpen = false;
  }
}
