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
    this.isApplyAvailable = false;

    this.title = 'phone_modal_replacement_title';
    this.loading = true;
    this.retrieveCompatibleReplacement();
  }

  retrieveCompatibleReplacement() {
    return this.OvhApiTelephony.Spare().v6().queryCompatibleReplacement({
      spare: this.spare,
    }).$promise
      .then((result) => {
        this.isApplyAvailable = true;
        this.compatibleDomains = result;
      })
      .catch(() => {
        this.isApplyAvailable = false;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  replaceSpare() {
    let actionResult = null;
    return this.OvhApiTelephony.Spare().v6().replaceSpare({
      spare: this.spare,
    }, {
      domain: this.domain,
      ip: this.ip,
    }).$promise.then(() => {
      actionResult = {
        isSucceed: true,
        messageToDisplay: 'phones_modal_replacement_succeed',
      };
    })
      .catch((err) => {
        actionResult = {
          isSucceed: false,
          messageToDisplay: 'phones_modal_replacement_failed',
          errorMessage: err.data.message,
          spare: this.spare,
        };
      }).finally(() => this.close(actionResult));
  }

  cancel() {
    return this.$uibModalInstance.dismiss();
  }

  close(actionResult) {
    return this.$uibModalInstance.close({ actionResult });
  }
}
