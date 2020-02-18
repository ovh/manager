const MESSAGES_CONTAINER_NAME = 'pci.projects.project.vouchers';

export default class CloudprojectbillingvouchersCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $translate,
    CucCloudMessage,
    CloudVouchersService,
    OvhApiOrderCloudProjectCredit,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CloudVouchersService = CloudVouchersService;
    this.OvhApiOrderCloudProjectCredit = OvhApiOrderCloudProjectCredit;

    this.messageHandler = CucCloudMessage.subscribe(MESSAGES_CONTAINER_NAME, {
      onMessage: () => this.refreshMessage(),
    });
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }

  $onInit() {
    return this.CloudVouchersService.getVouchers(
      this.$stateParams.projectId,
      this.deals,
    )
      .then((vouchers) => {
        this.vouchers = vouchers;
      })
      .catch((err) =>
        this.CucCloudMessage.error({
          text: `${this.$translate.instant('cpb_vouchers_get_error')} ${
            err.data
          }`,
        }),
      );
  }

  addCredit(amount) {
    return this.OvhApiOrderCloudProjectCredit.v6().save(
      {
        serviceName: this.$stateParams.projectId,
      },
      {
        amount,
      },
    ).$promise;
  }
}
