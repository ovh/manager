export default class {
  /* @ngInject */
  constructor($uibModalInstance, OvhApiXdsl, params) {
    this.$uibModalInstance = $uibModalInstance;
    this.OvhApiXdsl = OvhApiXdsl;
    this.spare = params.spare;
  }

  $onInit() {
    this.loading = false;
    this.title = 'xdsl_modem_modal_return_title';
  }

  returnMerchandise() {
    let actionResult = null;
    return this.OvhApiXdsl.Spare().v6().returnMerchandise({
      spare: this.spare,
    }, {}).$promise
      .then(() => {
        actionResult = {
          isSucceed: true,
          messageToDisplay: 'modems_modal_return_succeed',
        };
      })
      .catch((err) => {
        actionResult = {
          isSucceed: false,
          messageToDisplay: 'modems_modal_return_failed',
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
