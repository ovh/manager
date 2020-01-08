class LogsWelcomeCtrl {
  constructor(
    $state,
    LogsConstants,
    CucOrderHelperService,
    ovhDocUrl,
    coreConfig,
  ) {
    this.$state = $state;
    this.region = coreConfig.getRegion();
    this.LogsConstants = LogsConstants;
    this.CucOrderHelperService = CucOrderHelperService;
    this.ovhDocUrl = ovhDocUrl;
    this.urls = {};
  }

  $onInit() {
    this.urls.docsUrl = this.ovhDocUrl.getDocUrl(
      this.LogsConstants.LOGS_DOCS_NAME,
    );
    this.CucOrderHelperService.buildUrl(
      this.LogsConstants.LOGS_PRODUCT_URL,
    ).then((url) => {
      this.urls.productURL = url;
    });
    this.CucOrderHelperService.buildUrl(this.LogsConstants.ORDER_URL).then(
      (url) => {
        this.urls.orderURL = url;
      },
    );
  }
}

angular.module('managerApp').controller('LogsWelcomeCtrl', LogsWelcomeCtrl);
