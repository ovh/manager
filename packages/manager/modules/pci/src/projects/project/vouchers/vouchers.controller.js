const MESSAGES_CONTAINER_NAME = 'pci.projects.project.vouchers';
const VOUCHERS_POLLING_INTERVAL = 5000;

export default class CloudprojectbillingvouchersCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $timeout,
    $translate,
    CucCloudMessage,
    CloudVouchersService,
    OvhApiOrderCloudProjectCredit,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
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
    return this.pollVouchers().catch((err) =>
      this.CucCloudMessage.error({
        text: `${this.$translate.instant('cpb_vouchers_get_error')} ${
          err.data
        }`,
      }),
    );
  }

  $onDestroy() {
    if (this.vouchersPollingTask) {
      this.$timeout.cancel(this.vouchersPollingTask);
    }
  }

  pollVouchers() {
    return this.CloudVouchersService.getVouchers(
      this.$stateParams.projectId,
      this.deals,
    )
      .then((vouchers) => {
        this.vouchers = vouchers;
      })
      .then(() => {
        this.vouchersPollingTask = this.$timeout(
          () => this.pollVouchers(),
          VOUCHERS_POLLING_INTERVAL,
        );
      });
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
