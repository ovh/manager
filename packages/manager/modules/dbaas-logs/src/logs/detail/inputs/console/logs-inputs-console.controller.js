export default class LogsInputsConsoleCtrl {
  /* @ngInject */
  constructor($stateParams, CucControllerHelper, LogsInputsService, TailLogs) {
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.inputId = this.$stateParams.inputId;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsInputsService = LogsInputsService;
    this.TailLogs = TailLogs;
    this.initLoaders();
  }

  $onInit() {
    this.input.load();
    this.logger = new this.TailLogs({
      source: () => this.inputLogUrl.load().then((urlInfo) => urlInfo.data.url),
      delay: 10000,
    });
    this.logger.log();
  }

  /**
   * initializes the input log url
   *
   * @memberof LogsInputsConsoleCtrl
   */
  initLoaders() {
    this.inputLogUrl = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsInputsService.getInputLogUrl(this.serviceName, this.inputId),
    });
    this.input = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsInputsService.getInput(this.serviceName, this.inputId),
    });
  }
}
