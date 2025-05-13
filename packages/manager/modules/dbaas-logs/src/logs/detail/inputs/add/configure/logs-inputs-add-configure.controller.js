import find from 'lodash/find';

export default class LogsInputsAddConfigureCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $translate,
    CucControllerModalHelper,
    CucControllerHelper,
    LogsInputsService,
    LogsConstants,
    CucCloudMessage,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.serviceName = this.$stateParams.serviceName;
    this.inputId = this.$stateParams.inputId;
    this.exposedPort = this.$stateParams.exposedPort;
    this.CucControllerModalHelper = CucControllerModalHelper;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsInputsService = LogsInputsService;
    this.LogsConstants = LogsConstants;
    this.CucCloudMessage = CucCloudMessage;
    this.loading = false;
    this.initLoaders();
  }

  /**
   * initializes the input log url
   *
   * @memberof LogsInputsAddConfigureCtrl
   */
  initLoaders() {
    this.input = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsInputsService.getInputDetail(
          this.serviceName,
          this.inputId,
          true,
        ),
    });

    this.test = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsInputsService.getTestResults(
          this.serviceName,
          this.input.data,
        ),
    });

    this.previousTest = this.test;

    this.input.load().then(() => {
      this.previousTest.load();
    });
  }

  findRowLength(str) {
    if (str) {
      const lines = str.split(/\r\n|\r|\n/);
      return lines.length;
    }
    return this.LogsConstants.DEFAULT_LINE_NUMBER;
  }

  applyConfiguration(name) {
    const helper = find(this.input.data.helpers, { title: name });
    this.input.data.engine.configuration.inputSection = find(helper.sections, {
      name: 'LOGSTASH_INPUT',
    }).content.replace('INPUT_PORT', this.input.data.exposedPort);
    this.input.data.engine.configuration.filterSection = find(helper.sections, {
      name: 'LOGSTASH_FILTER',
    }).content;
    this.input.data.engine.configuration.patternSection = find(
      helper.sections,
      {
        name: 'LOGSTASH_PATTERN',
      },
    ).content;
  }

  executeTest() {
    this.loading = true;
    (this.logstashForm.$dirty
      ? this.LogsInputsService.updateLogstash(this.serviceName, this.input.data)
      : this.$q.when({})
    ).then(() => {
      this.LogsInputsService.executeTest(
        this.serviceName,
        this.input.data,
      ).then((result) => {
        this.loading = false;
        this.test = result;
      });
    });
  }

  saveFlowgger() {
    if (this.flowggerForm.$invalid) {
      return this.$q.reject();
    }
    if (!this.flowggerForm.$dirty) {
      return this.goToInputs();
    }
    this.CucCloudMessage.flushChildMessage();
    this.saving = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsInputsService.updateFlowgger(this.serviceName, this.input.data)
          .then(() => this.goToInputs())
          .finally(() => this.CucControllerHelper.scrollPageToTop()),
    });
    return this.saving.load();
  }

  saveLogstash() {
    if (this.logstashForm.$invalid) {
      return this.$q.reject();
    }
    if (!this.test.data.isValid) {
      return this.CucControllerModalHelper.showWarningModal({
        title: this.$translate.instant(
          'logs_inputs_logstash_save_warning_title',
        ),
        message: this.test.data.updatedAt
          ? this.$translate.instant(
              'logs_inputs_logstash_save_warning_unsuccessful',
            )
          : this.$translate.instant(
              'logs_inputs_logstash_save_warning_no_test',
            ),
      });
    }
    if (!this.logstashForm.$dirty) {
      this.goToInputs();
    }
    this.CucCloudMessage.flushChildMessage();
    this.saving = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsInputsService.updateLogstash(this.serviceName, this.input.data)
          .then(() => this.goToInputs())
          .finally(() => this.CucControllerHelper.scrollPageToTop()),
    });
    return this.saving.load();
  }

  getFlowggerLogFormats() {
    return this.LogsInputsService.getFlowggerLogFormats();
  }

  getDelimiters() {
    return this.LogsInputsService.getDelimiters();
  }

  goToInputs() {
    return this.$state.go('dbaas-logs.detail.inputs', {
      serviceName: this.serviceName,
    });
  }
}
