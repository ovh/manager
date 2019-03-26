export default class {
  /* @ngInject */
  constructor($stateParams, adpService, CucControllerHelper, CucCloudMessage, CucServiceHelper,
    adpConstants) {
    this.$stateParams = $stateParams;
    this.adpService = adpService;
    this.cucControllerHelper = CucControllerHelper;
    this.cucCloudMessage = CucCloudMessage;
    this.cucServiceHelper = CucServiceHelper;
    this.guideLinks = adpConstants.ADP_GUIDE_LINKS;
    this.serviceName = this.$stateParams.serviceName;
    this.details = null;
  }

  $onInit() {
    this.cucCloudMessage.unSubscribe('adp.service');
    this.messageHandler = this.cucCloudMessage.subscribe(
      'adp.service',
      { onMessage: () => this.refreshMessage() },
    );

    this.platformDetail = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.adpService.getAdpDetails(this.serviceName)
        .then((detail) => { this.details = detail; })
        .catch(error => this.cucServiceHelper.errorHandler('adp_get_platform_error')(error)),
    });
    return this.platformDetail.load();
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }
}
