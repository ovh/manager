const MESSAGES_CONTAINER_NAME = 'pci.projects.project.vouchers';
const VOUCHERS_POLLING_INTERVAL = 5000;

export default class CloudprojectbillingvouchersCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $interval,
    $translate,
    CucCloudMessage,
    CloudVouchersService,
    OvhApiOrderCloudProjectCredit,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$interval = $interval;
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
    return this.loadVouchers().then(
      () => !this.skipPolling && this.pollVouchers(),
    );
  }

  $onDestroy() {
    this.stopPolling();
  }

  stopPolling() {
    this.skipPolling = true;
    if (this.vouchersPollingTask) {
      this.$interval.cancel(this.vouchersPollingTask);
      this.vouchersPollingTask = null;
    }
  }

  loadVouchers() {
    return this.CloudVouchersService.getVouchers(
      this.$stateParams.projectId,
      this.deals,
    )
      .then((vouchers) => {
        this.vouchers = vouchers;
      })
      .catch(
        ({
          data: {
            data: { message },
          },
        }) => {
          this.CucCloudMessage.error({
            text: `${this.$translate.instant(
              'cpb_vouchers_get_error',
            )} ${message}`,
          });
          this.stopPolling();
          this.vouchers = [];
        },
      );
  }

  pollVouchers() {
    this.vouchersPollingTask = this.$interval(
      () => this.loadVouchers(),
      VOUCHERS_POLLING_INTERVAL,
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
