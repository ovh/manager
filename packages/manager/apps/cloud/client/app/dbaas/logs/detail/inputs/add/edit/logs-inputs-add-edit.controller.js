class LogsInputsAddEditCtrl {
  constructor($q, $state, $stateParams, CucCloudMessage, CucControllerHelper, LogsConstants,
    LogsInputsService, LogsStreamsService) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.inputId = this.$stateParams.inputId;
    this.CucCloudMessage = CucCloudMessage;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsConstants = LogsConstants;
    this.LogsInputsService = LogsInputsService;
    this.LogsStreamsService = LogsStreamsService;

    this.editMode = Boolean(this.inputId);
    this.availableEngines = [];
    this.initLoaders();
  }

  $onInit() {
    if (this.editMode) {
      this.input.load();
    } else {
      this.input = this.LogsInputsService.getNewInput();
    }
    this.details.load()
      .then((details) => {
        this.availableEngines = details.engines.reduce((enginesList, engine) => {
          if (!engine.isDeprecated) {
            enginesList.push(engine);
          }
          return enginesList;
        }, []);
      });
    this.streams.load();
    this.options.load();
    this.mainOffer.load();
  }

  /**
   * initializes the input log url
   *
   * @memberof LogsInputsAddEditCtrl
   */
  initLoaders() {
    if (this.editMode) {
      this.input = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () => this.LogsInputsService.getInput(this.serviceName, this.inputId)
          .then((input) => this.LogsInputsService.transformInput(input)),
      });
    }
    this.details = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.LogsInputsService.getDetails(this.serviceName),
    });
    this.streams = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.LogsStreamsService.getStreams(this.serviceName),
    });
    this.options = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.LogsInputsService.getSubscribedOptions(this.serviceName),
    });
    this.mainOffer = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.LogsInputsService.getMainOffer(this.serviceName),
    });
  }

  addEditInput() {
    if (this.form.$invalid) {
      return this.$q.reject();
    } if (!this.form.$dirty) {
      return this.gotToNextStep(this.inputId);
    }
    this.CucCloudMessage.flushChildMessage();
    this.inputAddEdit = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => (this.editMode
        ? this.LogsInputsService.updateInput(this.serviceName, this.input.data)
        : this.LogsInputsService.addInput(this.serviceName, this.input.data)),
    });
    return this.inputAddEdit.load()
      .then((successData) => {
        this.gotToNextStep(this.inputId || successData[0].item.inputId);
      })
      .catch(() => this.CucControllerHelper.scrollPageToTop());
  }

  gotToNextStep(inputId) {
    this.$state.go('dbaas.logs.detail.inputs.editwizard.configure', {
      serviceName: this.serviceName,
      inputId,
    });
    return this.$q.resolve();
  }
}

angular.module('managerApp').controller('LogsInputsAddEditCtrl', LogsInputsAddEditCtrl);
