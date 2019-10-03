export default class {
  /* @ngInject */
  constructor($uibModalInstance, OvhApiXdsl, params) {
    this.$uibModalInstance = $uibModalInstance;
    this.OvhApiXdsl = OvhApiXdsl;
    this.spare = params.spare;
  }

  $onInit() {
    this.loading = false;
    this.title = 'xdsl_modem_modal_delete_title';
  }

  deleteSpare() {
    let actionResult = null;
    return this.OvhApiXdsl.Spare().v6().deleteSpare({
      spare: this.spare,
    }).$promise
      .then(() => {
        actionResult = {
          isSucceed: true,
          messageToDisplay: 'modems_modal_delete_succeed',
        };
      })
      .catch((err) => {
        actionResult = {
          isSucceed: false,
          messageToDisplay: 'modems_modal_delete_failed',
          errorMessage: err.data.message,
        };
      })
      .finally(() => this.close(actionResult));
  }

  cancel() {
    return this.$uibModalInstance.dismiss();
  }

  close(actionResult) {
    return this.$uibModalInstance.close({ actionResult });
  }
}
