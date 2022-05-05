export default class NashaDashboardController {
  constructor() {
    this.isEditNameModalOpened = false;
    this.closeEditNameModal = this.closeEditNameModal.bind(this);
  }

  openEditNameModal() {
    this.isEditNameModalOpened = true;
  }

  closeEditNameModal({ success, error }) {
    this.isEditNameModalOpened = false;
    if (success) {
      this.reload({ success });
    }
    if (error) {
      this.alertError(error);
    }
  }
}
