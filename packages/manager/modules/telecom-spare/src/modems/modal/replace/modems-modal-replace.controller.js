export default class {
  /* @ngInject */
  constructor($uibModalInstance, OvhApiXdsl, params) {
    this.$uibModalInstance = $uibModalInstance;
    this.OvhApiXdsl = OvhApiXdsl;
    this.spare = params.spare;
  }

  $onInit() {
    this.isApplyAvailable = false;

    this.selectedDomain = '';

    this.loading = false;
    this.title = 'xdsl_modem_modal_replacement_title';
    this.loading = true;
    this.retrieveCompatibleReplacement();
  }

  retrieveCompatibleReplacement() {
    return this.OvhApiXdsl.Spare().v6().queryCompatibleReplacement({
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
    return this.OvhApiXdsl.Spare().v6().replaceSpare({
      spare: this.spare,
    }, {
      domain: this.domain,
    }).$promise.then(() => {
      actionResult = {
        isSucceed: true,
        messageToDisplay: 'modems_modal_replacement_succeed',
      };
    })
      .catch((err) => {
        actionResult = {
          isSucceed: false,
          messageToDisplay: 'modems_modal_replacement_failed',
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
