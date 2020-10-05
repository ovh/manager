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
    this.CucControllerModalHelper = CucControllerModalHelper;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsInputsService = LogsInputsService;
    this.LogsConstants = LogsConstants;
    this.CucCloudMessage = CucCloudMessage;
    this.configuration = {
      engineType: '',
      flowgger: {},
      logstash: {},
    };
    this.loading = {
      engine: false,
    };
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
        this.LogsInputsService.getInput(this.serviceName, this.inputId).then(
          (input) => {
            this.configuration.engineType = input.info.engine.name;
            if (this.configuration.engineType === this.LogsConstants.logstash) {
              this.initLogstash(input.info.engine.configuration);
            } else {
              this.initFlowgger(input.info.engine.configuration);
            }
            return input;
          },
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
      if (this.configuration.engineType === this.LogsConstants.logstash) {
        this.getEngine();
      }
    });
  }

  getEngine() {
    this.loading.engine = true;
    this.LogsInputsService.getDetails(this.serviceName).then((details) => {
      this.engine = find(details.engines, {
        engineId: this.input.data.info.engineId,
      });
      this.loading.engine = false;
    });
  }

  initFlowgger(configuration) {
    this.configuration.flowgger.logFormat = configuration.logFormat;
    this.configuration.flowgger.logFraming = configuration.logFraming;
  }

  static findRowLength(str) {
    const lines = str.split(/\r\n|\r|\n/);
    return lines.length;
  }

  initLogstash(configuration) {
    this.configuration.logstash.inputSection = this.CucControllerHelper.constructor.htmlDecode(
      configuration.inputSection,
    );
    this.configuration.logstash.filterSection = this.CucControllerHelper.constructor.htmlDecode(
      configuration.filterSection,
    );
    this.configuration.logstash.patternSection = this.CucControllerHelper.constructor.htmlDecode(
      configuration.patternSection,
    );
  }

  applyConfiguration(name) {
    const helper = find(this.engine.helpers, { title: name });
    this.configuration.logstash.inputSection = find(helper.sections, {
      name: 'LOGSTASH_INPUT',
    }).content.replace('INPUT_PORT', this.input.data.info.exposedPort);
    this.configuration.logstash.filterSection = find(helper.sections, {
      name: 'LOGSTASH_FILTER',
    }).content;
    this.configuration.logstash.patternSection = find(helper.sections, {
      name: 'LOGSTASH_PATTERN',
    }).content;
  }

  executeTest() {
    this.CucCloudMessage.flushChildMessage();
    this.test = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        (this.logstashForm.$dirty
          ? this.LogsInputsService.updateLogstash(
              this.serviceName,
              this.input.data,
              this.configuration.logstash,
            )
          : this.$q.when({})
        )
          .then(() =>
            this.LogsInputsService.executeTest(
              this.serviceName,
              this.input.data,
            ),
          )
          .catch(() => this.CucControllerHelper.scrollPageToTop()),
    });
    this.test.load();
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
        this.LogsInputsService.updateFlowgger(
          this.serviceName,
          this.input.data,
          this.configuration.flowgger,
        )
          .then(() => this.goToInputs())
          .finally(() => this.CucControllerHelper.scrollPageToTop()),
    });
    return this.saving.load();
  }

  saveLogstash() {
    if (this.logstashForm.$invalid) {
      return this.$q.reject();
    }
    if (!this.test.data.stdout) {
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
        this.LogsInputsService.updateLogstash(
          this.serviceName,
          this.input.data,
          this.configuration.logstash,
        )
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
