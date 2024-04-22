export default class IPv6SubnetAddModalCtrl {
  onSubmit() {
    if (this.formName.$valid) {
      this.onConfirm()(this.subnet, this.address);
      this.closeModal();
    }
  }

  closeModal() {
    this.subnet = '';
    this.address = '';
    this.isOpenModal = false;
  }
}
