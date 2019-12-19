const MESSAGES_CONTAINER_NAME = 'pci.projects.project.vouchers';

export default class CloudProjectBillingVoucherAddCtrl {
  /* @ngInject */
  constructor(
    $state,
    $stateParams,
    $translate,
    CucCloudMessage,
    OvhApiCloudProjectCredit,
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProjectCredit = OvhApiCloudProjectCredit;

    this.model = {
      value: null,
    };
  }

  add() {
    this.isLoading = true;
    this.OvhApiCloudProjectCredit
      .v6()
      .save({
        serviceName: this.$stateParams.projectId,
      }, {
        code: this.model.value,
      })
      .$promise
      .then(() => this.CucCloudMessage.success(this.$translate.instant('cpb_vouchers_add_success'), MESSAGES_CONTAINER_NAME))
      .catch((err) => this.CucCloudMessage.error(this.$translate.instant('cpb_vouchers_add_error') + (err.data && err.data.message ? ` (${err.data.message})` : ''), MESSAGES_CONTAINER_NAME))
      .finally(() => this.cancel());
  }

  cancel() {
    return this.$state.go('^');
  }
}
