import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import set from 'lodash/set';
import trim from 'lodash/trim';
import find from 'lodash/find';

export default class LogsInputsService {
  /* @ngInject */
  constructor(
    $q,
    $http,
    $stateParams,
    iceberg,
    CucCloudMessage,
    CucCloudPoll,
    LogsHelperService,
    LogsConstants,
    CucServiceHelper,
    CucControllerHelper,
  ) {
    this.$q = $q;
    this.$http = $http;
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.iceberg = iceberg;
    this.CucCloudMessage = CucCloudMessage;
    this.CucCloudPoll = CucCloudPoll;
    this.LogsConstants = LogsConstants;
    this.CucServiceHelper = CucServiceHelper;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsHelperService = LogsHelperService;
    this.initializeData();
  }

  initializeData() {
    this.flowggerLogFormats = [
      {
        value: 'GELF',
        name: 'inputs_logs_configure_format_gelf',
      },
      {
        value: 'RFC5424',
        name: 'inputs_logs_configure_format_rfc',
      },
      {
        value: 'LTSV',
        name: 'inputs_logs_configure_format_ltsv',
      },
      {
        value: 'CAPNP',
        name: 'inputs_logs_configure_format_cap_proto',
      },
    ];

    this.delimiters = [
      {
        value: 'LINE',
        name: 'inputs_logs_configure_delimiter_line',
      },
      {
        value: 'NUL',
        name: 'inputs_logs_configure_delimiter_nul',
      },
      {
        value: 'SYSLEN',
        name: 'inputs_logs_configure_delimiter_syslen',
      },
      {
        value: 'CAPNP',
        name: 'inputs_logs_configure_format_cap_proto',
      },
    ];
    this.allowedNetworks = [];
  }

  getInputEngines(serviceName) {
    return this.iceberg(`/dbaas/logs/${serviceName}/input/engine`)
      .query()
      .expand('CachedObjectList-Pages')
      .limit(10000)
      .execute().$promise;
  }

  getInputEngineHelpers(serviceName, engineId) {
    return this.iceberg(
      `/dbaas/logs/${serviceName}/input/engine/${engineId}/helper`,
    )
      .query()
      .expand('CachedObjectList-Pages')
      .limit(10000)
      .execute().$promise;
  }

  getFlowggerLogFormats() {
    return this.flowggerLogFormats;
  }

  getDelimiters() {
    return this.delimiters;
  }

  /**
   * add input
   *
   * @param {any} serviceName
   * @param {any} input, input object to be added
   * @returns promise which will resolve with the operation object
   * @memberof LogsInputsService
   */
  addInput(serviceName, input) {
    return this.$http
      .post(
        `/dbaas/logs/${serviceName}/input`,
        this.transformInputToSave(input),
      )
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_inputs_add_error', err, {
          inputTitle: input.title,
        }),
      );
  }

  /**
   * delete input
   *
   * @param {any} serviceName
   * @param {any} input, input object to be deleted
   * @returns promise which will resolve with the operation object
   * @memberof LogsInputsService
   */
  deleteInput(serviceName, input) {
    return this.$http
      .delete(`/dbaas/logs/${serviceName}/input/${input.inputId}`)
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_inputs_delete_success',
          { inputTitle: input.title },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_inputs_delete_error', err, {
          inputTitle: input.title,
        }),
      );
  }

  /**
   * returns array of Input IDs of logged in user
   *
   * @param {any} serviceName
   * @returns promise which will be resolve to array of input IDs
   * @memberof LogsInputsService
   */
  getPaginatedInputs(
    serviceName,
    offset = 0,
    pageSize = 25,
    sort = { name: 'title', dir: 'desc' },
    filters = null,
  ) {
    let res = this.iceberg(`/dbaas/logs/${serviceName}/input`)
      .query()
      .expand('CachedObjectList-Pages')
      .limit(pageSize)
      .offset(offset)
      .sort(sort.name, sort.dir);
    if (filters !== null) {
      filters.forEach((filter) => {
        res = res.addFilter(filter.name, filter.operator, filter.value);
      });
    }
    return res.execute().$promise.then((response) => ({
      data: response.data.map((input) => this.transformInput(input)),
      meta: {
        totalCount:
          parseInt(response.headers['x-pagination-elements'], 10) || 0,
      },
    }));
  }

  /**
   * returns details of an input
   *
   * @param {any} serviceName
   * @param {any} inputId
   * @returns promise which will be resolve to an input object
   * @memberof LogsInputsService
   */
  getInput(serviceName, inputId) {
    return this.$http
      .get(`/dbaas/logs/${serviceName}/input/${inputId}`)
      .catch((err) =>
        this.LogsHelperService.handleError('logs_inputs_get_error', err, {}),
      );
  }

  /**
   * returns details of an input and transforms it
   *
   * @param {any} serviceName
   * @param {any} inputId
   * @returns promise which will be resolve to an input object
   * @memberof LogsInputsService
   */
  getInputDetail(serviceName, inputId, extra) {
    return this.getInput(serviceName, inputId).then((input) =>
      this.transformInput(input.data, extra),
    );
  }

  /**
   * gets a temporary url to retrive the input logs
   *
   * @param {any} serviceName
   * @param {any} inputId
   * @returns promise which will resolve with the temporary url
   * @memberof LogsInputsService
   */
  getInputLogUrl(serviceName, inputId) {
    return this.$http
      .post(`/dbaas/logs/${serviceName}/input/${inputId}/logs/url`)
      .catch((err) =>
        this.LogsHelperService.handleError('logs_inputs_logurl_error', err, {}),
      );
  }

  getNewInput() {
    return {
      data: {
        exposedPort: this.LogsConstants.INPUT_DEFAULT_PORT,
        nbInstance: this.LogsConstants.INPUT_DEFAULT_NB_INSTANCE,
        autoscale: this.LogsConstants.INPUT_DEFAULT_AUTOSCALE,
        minScaleInstance: this.LogsConstants
          .INPUT_DEFAULT_AUTOSCALE_MIN_INSTANCE,
        maxScaleInstance: this.LogsConstants
          .INPUT_DEFAULT_AUTOSCALE_MAX_INSTANCE,
      },
      loading: false,
    };
  }

  /**
   * restart an input
   *
   * @param {any} serviceName
   * @param {any} inputId
   * @returns promise which will resolve with the operation object
   * @memberof LogsInputsService
   */
  restartInput(serviceName, input) {
    return this.$http
      .post(`/dbaas/logs/${serviceName}/input/${input.inputId}/restart`)
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_inputs_restart_success',
          { inputTitle: input.title },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_inputs_restart_error', err, {
          inputTitle: input.title,
        }),
      );
  }

  /**
   * start an input
   *
   * @param {any} serviceName
   * @param {any} inputId
   * @returns promise which will resolve with the operation object
   * @memberof LogsInputsService
   */
  startInput(serviceName, input) {
    return this.$http
      .post(`/dbaas/logs/${serviceName}/input/${input.inputId}/start`)
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_inputs_start_success',
          { inputTitle: input.title },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_inputs_start_error', err, {
          inputTitle: input.title,
        }),
      );
  }

  /**
   * stop an input
   *
   * @param {any} serviceName
   * @param {any} inputId
   * @returns promise which will resolve with the operation object
   * @memberof LogsInputsService
   */
  stopInput(serviceName, input) {
    return this.$http
      .post(`/dbaas/logs/${serviceName}/input/${input.inputId}/end`)
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_inputs_stop_success',
          { inputTitle: input.title },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_inputs_stop_error', err, {
          inputTitle: input.title,
        }),
      );
  }

  /**
   * transforms the input by adding some additional information
   *
   * @param {any} input
   * @returns the transformed input
   * @memberof LogsInputsService
   */
  transformInput(input, extra) {
    this.getInputEngines(this.serviceName).then((engines) => {
      const engine = find(
        engines.data,
        (inputEngine) => input.engineId === inputEngine.engineId,
      );
      set(input, 'engine.software', [engine.name, engine.version].join(' '));
      if (extra) {
        set(input, 'engine.name', engine.name);
        set(input, 'engine.version', engine.version);
        if (engine.name === this.LogsConstants.logstash) {
          this.getInputEngineHelpers(this.serviceName, input.engineId).then(
            (helpers) => {
              set(input, 'helpers', helpers.data);
            },
          );
          this.getLogstashConfiguration(this.serviceName, input).then(
            (configuration) => {
              set(
                input,
                'engine.configuration.inputSection',
                this.CucControllerHelper.constructor.htmlDecode(
                  configuration.data.inputSection,
                ),
              );
              set(
                input,
                'engine.configuration.filterSection',
                this.CucControllerHelper.constructor.htmlDecode(
                  configuration.data.filterSection,
                ),
              );
              set(
                input,
                'engine.configuration.patternSection',
                this.CucControllerHelper.constructor.htmlDecode(
                  configuration.data.patternSection,
                ),
              );
            },
          );
        } else {
          this.getFlowggerConfiguration(this.serviceName, input).then(
            (configuration) => {
              set(input, 'engine.configuration', configuration.data);
            },
          );
        }
      }
    });
    set(input, 'exposedPort', parseInt(input.exposedPort, 10));
    if (Array.isArray(input.allowedNetworks)) {
      set(input, 'allowedNetworks', input.allowedNetworks.join(', '));
    }
    this.getInputActions(this.serviceName, input).then((allowedActions) => {
      set(
        input,
        'actionsMap',
        allowedActions.data.reduce((actions, action) => {
          // eslint-disable-next-line no-param-reassign
          actions[action.type] = action.isAllowed;
          return actions;
        }, {}),
      );
      const isProcessing =
        input.status === this.LogsConstants.inputStatus.PROCESSING;
      const isToBeConfigured =
        input.status === this.LogsConstants.inputStatus.INIT &&
        !input.actionsMap.START;
      const isPending =
        (input.status === this.LogsConstants.inputStatus.INIT ||
          input.status === this.LogsConstants.inputStatus.PENDING) &&
        input.actionsMap.START;
      const isRunning = input.status === this.LogsConstants.inputStatus.RUNNING;

      /* eslint-disable no-nested-ternary */
      set(
        input,
        'state',
        isProcessing
          ? this.LogsConstants.inputState.PROCESSING
          : input.isRestartRequired
          ? this.LogsConstants.inputState.RESTART_REQUIRED
          : isToBeConfigured
          ? this.LogsConstants.inputState.TO_CONFIGURE
          : isPending
          ? this.LogsConstants.inputState.PENDING
          : isRunning
          ? this.LogsConstants.inputState.RUNNING
          : this.LogsConstants.inputState.UNKNOWN,
      );
      /* eslint-disable no-nested-ternary */
      set(input, 'stateType', this.LogsConstants.inputStateType[input.state]);
    });
    /* eslint-disable no-nested-ternary */
    set(input, 'stateType', this.LogsConstants.inputStateType[input.state]);
    if (input.autoscale === false) {
      // In the edit form, set the default values so they can be displayed in the form
      // Function transformInputToSave will manage the removal of these properties if needed
      set(
        input,
        'minScaleInstance',
        this.LogsConstants.INPUT_DEFAULT_AUTOSCALE_MIN_INSTANCE,
      );
      set(
        input,
        'maxScaleInstance',
        this.LogsConstants.INPUT_DEFAULT_AUTOSCALE_MAX_INSTANCE,
      );
    }
    return input;
  }

  executeTest(serviceName, input) {
    return this.$http
      .post(`/dbaas/logs/${serviceName}/input/${input.inputId}/configtest`)
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_inputs_stop_success',
          { inputTitle: input.title },
        ).then(() => this.getTestResults(serviceName, input));
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_inputs_test_error', err, {
          inputTitle: input.title,
        }),
      );
  }

  updateFlowgger(serviceName, input) {
    return this.$http
      .put(
        `/dbaas/logs/${serviceName}/input/${input.inputId}/configuration/flowgger`,
        {
          logFormat: input.engine.configuration.logFormat,
          logFraming: input.engine.configuration.logFraming,
        },
      )
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_inputs_update_success',
          { inputTitle: input.title },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError(
          'logs_inputs_flowgger_update_error',
          err,
          {
            inputTitle: input.title,
          },
        ),
      );
  }

  getLogstashConfiguration(serviceName, input) {
    return this.$http.get(
      `/dbaas/logs/${serviceName}/input/${input.inputId}/configuration/logstash`,
    );
  }

  getFlowggerConfiguration(serviceName, input) {
    return this.$http.get(
      `/dbaas/logs/${serviceName}/input/${input.inputId}/configuration/flowgger`,
    );
  }

  updateLogstash(serviceName, input) {
    return this.$http
      .put(
        `/dbaas/logs/${serviceName}/input/${input.inputId}/configuration/logstash`,
        {
          filterSection: input.engine.configuration.filterSection,
          inputSection: input.engine.configuration.inputSection,
          patternSection: input.engine.configuration.patternSection,
        },
      )
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_inputs_update_success',
          { inputTitle: input.title },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError(
          'logs_inputs_logstash_update_error',
          err,
          {
            inputTitle: input.title,
          },
        ),
      );
  }

  /**
   * update input
   *
   * @param {any} serviceName
   * @param {any} input, input object to be updated
   * @returns promise which will resolve with the operation object
   * @memberof LogsInputsService
   */
  updateInput(serviceName, input) {
    return this.$http
      .put(
        `/dbaas/logs/${serviceName}/input/${input.inputId}`,
        this.transformInputToSave(input),
      )
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_inputs_update_error', err, {
          inputTitle: input.title,
        }),
      );
  }

  getTestResults(serviceName, input) {
    return this.$http.get(
      `/dbaas/logs/${serviceName}/input/${input.inputId}/configtest/result`,
    );
  }

  getInputActions(serviceName, input) {
    return this.$http.get(
      `/dbaas/logs/${serviceName}/input/${input.inputId}/action`,
    );
  }

  static transformDetails(details) {
    details.engines.forEach((engine) => {
      if (!engine.isDeprecated) {
        set(
          engine,
          'name',
          engine.name.charAt(0).toUpperCase() +
            engine.name.toLowerCase().slice(1),
        );
      }
    });
    return details;
  }

  transformInputToSave(input) {
    if (!isEmpty(trim(input.allowedNetworks))) {
      this.allowedNetworks = map(input.allowedNetworks.split(','), (source) =>
        trim(source),
      );
    } else {
      this.allowedNetworks = [];
    }
    return {
      title: input.title,
      description: input.description,
      engineId: input.engineId,
      autoscale: input.autoscale,
      // Add the nbInstance property only if autoscale mode is false
      ...(!input.autoscale &&
        input.nbInstance && { nbInstance: input.nbInstance }),
      // Add the autoscale needed properties only if autoscale mode is true
      ...(input.autoscale && {
        minScaleInstance: input.minScaleInstance,
        maxScaleInstance: input.maxScaleInstance,
        scalingNotifyEnabled: input.scalingNotifyEnabled,
      }),
      allowedNetworks: this.allowedNetworks,
      streamId: input.streamId,
      exposedPort: input.exposedPort.toString(),
    };
  }
}
