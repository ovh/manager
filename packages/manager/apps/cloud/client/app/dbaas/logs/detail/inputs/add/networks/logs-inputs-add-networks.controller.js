class LogsInputsAddNetworksCtrl {
  constructor(
    $q,
    $stateParams,
    CucControllerHelper,
    LogsInputsService,
    CucCloudMessage,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.inputId = this.$stateParams.inputId;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsInputsService = LogsInputsService;
    this.CucCloudMessage = CucCloudMessage;
    this.editMode = Boolean(this.inputId);

    this.initLoaders();
  }

  initLoaders() {
    this.input = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsInputsService.getInput(this.serviceName, this.inputId).then(
          (input) => {
            input.allowedNetworks.push({
              network: null,
            });
            return input;
          },
        ),
    });
    this.input.load();
  }

  addNetwork(network) {
    if (this.form.$invalid) {
      return this.$q.reject();
    }
    this.CucCloudMessage.flushChildMessage();
    this.saving = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsInputsService.addNetwork(
          this.serviceName,
          this.input.data,
          network,
        )
          .then(() => this.input.load())
          .catch(() => this.CucControllerHelper.scrollPageToTop()),
    });
    return this.saving.load();
  }

  removeNetwork(network) {
    this.CucCloudMessage.flushChildMessage();
    this.saving = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsInputsService.removeNetwork(
          this.serviceName,
          this.input.data,
          network,
        )
          .then(() => this.input.load())
          .catch(() => this.CucControllerHelper.scrollPageToTop()),
    });
    return this.saving.load();
  }
}

angular
  .module('managerApp')
  .controller('LogsInputsAddNetworksCtrl', LogsInputsAddNetworksCtrl);
