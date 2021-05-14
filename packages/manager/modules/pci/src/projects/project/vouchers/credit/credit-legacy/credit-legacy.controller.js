const MESSAGES_CONTAINER_NAME = 'pci.projects.project.vouchers';

export default class CloudProjectBillingVouchersAddcreditCtrl {
  /* @ngInject */
  constructor(
    $state,
    $stateParams,
    $translate,
    CucCloudMessage,
    OvhApiMe,
    OvhApiOrderCloudProjectCredit,
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiMe = OvhApiMe;
    this.OvhApiOrderCloudProjectCredit = OvhApiOrderCloudProjectCredit;
    this.amount = 10;
  }

  add() {
    this.isLoading = true;
    return this.OvhApiOrderCloudProjectCredit.v6()
      .save(
        {
          serviceName: this.$stateParams.projectId,
        },
        {
          amount: this.amount,
        },
      )
      .$promise.then(({ url }) => {
        this.CucCloudMessage.success({
          textHtml: this.$translate.instant('cpb_vouchers_add_credit_success', {
            url,
            amount: this.amount,
          }),
          MESSAGES_CONTAINER_NAME,
        });
      })
      .catch((err) =>
        this.CucCloudMessage.error(
          this.$translate.instant('cpb_vouchers_add_credit_load_err') +
            (err.data && err.data.message ? ` (${err.data.message})` : ''),
          MESSAGES_CONTAINER_NAME,
        ),
      )
      .finally(() => this.cancel());
  }

  cancel() {
    return this.$state.go('^');
  }
}
