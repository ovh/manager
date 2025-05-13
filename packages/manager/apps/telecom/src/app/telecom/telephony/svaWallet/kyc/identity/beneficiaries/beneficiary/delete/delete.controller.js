export default class DeleteController {
  /* @ngInject */
  constructor($uibModalInstance) {
    this.$uibModalInstance = $uibModalInstance;
  }

  confirm() {
    if (!this.form.$invalid) {
      this.$uibModalInstance.close();
    }
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  }
}
