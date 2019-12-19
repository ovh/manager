const MESSAGES_CONTAINER_NAME = 'pci.projects.project.vouchers';

export default class CloudprojectbillingvouchersCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $translate,
    CucCloudMessage,
    CucControllerHelper,
    CloudVouchersService,
    guideUrl,
    OvhApiOrderCloudProjectCredit,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucControllerHelper = CucControllerHelper;
    this.CloudVouchersService = CloudVouchersService;
    this.guideUrl = guideUrl;
    this.OvhApiOrderCloudProjectCredit = OvhApiOrderCloudProjectCredit;

    this.messageHandler = CucCloudMessage.subscribe(MESSAGES_CONTAINER_NAME, {
      onMessage: () => this.refreshMessage(),
    });

    this.vouchers = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.CloudVouchersService.getVouchers($stateParams.projectId),
      errorHandler: (err) => this.CucCloudMessage.error({
        text: `${this.$translate.instant('cpb_vouchers_get_error')} ${err.data}`,
      }),
    });
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }

  $onInit() {
    this.vouchers.load();
  }

  addCredit(amount) {
    return this.OvhApiOrderCloudProjectCredit.v6().save({
      serviceName: this.$stateParams.projectId,
    }, {
      amount,
    }).$promise;
  }
}
