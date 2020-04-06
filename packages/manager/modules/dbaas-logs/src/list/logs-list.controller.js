export default class LogsListCtrl {
  /* @ngInject */
  constructor(
    $state,
    CucCloudMessage,
    LogsListService,
    DbaasLogsConstants,
    LogsHelperService,
    CucOrderHelperService,
  ) {
    this.$state = $state;
    this.CucCloudMessage = CucCloudMessage;
    this.LogsListService = LogsListService;
    this.DbaasLogsConstants = DbaasLogsConstants;
    this.LogsHelperService = LogsHelperService;
    this.CucOrderHelperService = CucOrderHelperService;
    this.messages = [];

    this.initLoaders();
  }

  $onInit() {
    this.CucCloudMessage.unSubscribe('dbaas-logs.list');
    this.messageHandler = this.CucCloudMessage.subscribe('dbaas-logs.list', {
      onMessage: () => this.refreshMessage(),
    });
    this.CucOrderHelperService.buildUrl(this.DbaasLogsConstants.ORDER_URL).then(
      (url) => {
        this.orderURL = url;
      },
    );
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }

  goToOptionsPage(service) {
    if (service.isBasicOffer) {
      this.LogsHelperService.showOfferUpgradeModal(service.serviceName);
    } else {
      this.$state.go('dbaas-logs.detail.options', {
        serviceName: service.serviceName,
      });
    }
  }

  goToOfferPage(service) {
    this.$state.go('dbaas-logs.detail.offer', {
      serviceName: service.serviceName,
    });
  }

  initLoaders() {
    return this.LogsListService.getServices().then((list) => {
      this.accounts = list;
    });
  }
}
