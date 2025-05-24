export default class LogsIamEnableModalCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $uibModalInstance,
    $translate,
    CucControllerHelper,
    CucCloudMessage,
    LogsHomeService,
  ) {
    this.$stateParams = $stateParams;
    this.$q = $q;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.LogsHomeService = LogsHomeService;
    this.$uibModalInstance = $uibModalInstance;
    this.$translate = $translate;
    this.serviceName = $stateParams.serviceName;
  }

  $onInit() {
    this.initLoaders();
    this.title = this.$translate.instant('logs_iam_modal_enable_title', {
      accountName: this.serviceName,
    });
    this.accountDetails.load().then(() => {
      this.service = this.accountDetails.data;
    });
  }

  initLoaders() {
    this.accountDetails = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsHomeService.getAccountDetails(this.serviceName),
    });
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  enableIam() {
    this.CucCloudMessage.flushChildMessage();
    this.saving = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsHomeService.enableIam(this.serviceName, this.service)
          .then((response) => this.$uibModalInstance.close(response))
          .catch((response) => this.$uibModalInstance.dismiss(response))
          .finally(() => {
            this.CucControllerHelper.scrollPageToTop();
            this.$uibModalInstance.close();
          }),
    });
    return this.saving.load();
  }
}
