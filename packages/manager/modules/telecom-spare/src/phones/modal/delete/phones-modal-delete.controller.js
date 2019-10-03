export default class {
  /* @ngInject */
  constructor($uibModalInstance, OvhApiTelephony, params) {
    this.$uibModalInstance = $uibModalInstance;
    this.OvhApiTelephony = OvhApiTelephony;
    this.action = params.action;
    this.spare = params.spare;

    this.phoneIP = null;

    this.selectedDomain = '';
  }

  $onInit() {
    this.loading = false;
    this.title = 'phone_modal_delete_title';
  }

  deleteSpare() {
    let actionResult = null;
    return this.OvhApiTelephony.Spare().v6().deleteSpare({
      spare: this.spare,
    }).$promise
      .then(() => {
        actionResult = {
          isSucceed: true,
          messageToDisplay: 'phones_modal_delete_succeed',
        };
      })
      .catch((err) => {
        actionResult = {
          isSucceed: false,
          messageToDisplay: 'phones_modal_delete_failed',
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
