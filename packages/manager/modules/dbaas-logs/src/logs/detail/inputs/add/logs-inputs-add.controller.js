export default class LogsInputsAddCtrl {
  /* @ngInject */
  constructor($state, $stateParams, CucControllerHelper, LogsInputsService) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.inputId = this.$stateParams.inputId;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsInputsService = LogsInputsService;
    this.editMode = Boolean(this.inputId);
    this.initLoaders();
  }

  $onInit() {
    if (this.editMode) {
      this.input.load();
    } else {
      this.input = this.LogsInputsService.getNewInput();
    }
  }

  /**
   * initializes the input log url
   *
   * @memberof LogsInputsAddCtrl
   */
  initLoaders() {
    if (this.editMode) {
      this.input = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () =>
          this.LogsInputsService.getInput(this.serviceName, this.inputId),
      });
    }
  }

  gotoInputsHome() {
    this.$state.go('dbaas-logs.detail.inputs');
  }
}
