export default class {
  /* @ngInject */
  constructor($state, $stateParams, adpService,
    CucControllerHelper, CucCloudMessage, CucServiceHelper, ADP_GUIDE_LINKS, ADP_STATUS) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.adpService = adpService;
    this.cucControllerHelper = CucControllerHelper;
    this.cucCloudMessage = CucCloudMessage;
    this.cucServiceHelper = CucServiceHelper;
    this.guideLinks = ADP_GUIDE_LINKS;
    this.ADP_STATUS = ADP_STATUS;
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
        .then((detail) => {
          this.details = detail;
          if (this.adpService.isDeploymentInProgress(detail)) {
            this.$state.go('adp.service.progress');
          }
        })
        .catch(error => this.cucServiceHelper.errorHandler('adp_get_platform_error')(error)),
    });
    return this.platformDetail.load();
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages()
      .filter(message => message.origin === 'adp.deploy');
  }
}
