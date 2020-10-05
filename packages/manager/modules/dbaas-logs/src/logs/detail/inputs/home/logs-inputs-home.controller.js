import set from 'lodash/set';

import template from './info/logs-inputs-home-info.html';

export default class LogsInputsHomeCtrl {
  /* @ngInject */
  constructor(
    $state,
    $stateParams,
    $translate,
    CucCloudMessage,
    CucControllerHelper,
    LogsConstants,
    LogsInputsService,
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsConstants = LogsConstants;
    this.LogsInputsService = LogsInputsService;
    this.initLoaders();
  }

  $onInit() {
    this.runLoaders();
  }

  /**
   * Deletes the input
   *
   * @param {any} input - the input object
   * @memberof LogsInputsCtrl
   */
  delete(input) {
    this.delete = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsInputsService.deleteInput(
          this.serviceName,
          input,
        ).finally(() => this.CucControllerHelper.scrollPageToTop()),
    });
    this.delete.load().then(() => this.runLoaders());
  }

  /**
   * Executes an action on the input
   *
   * @param {any} input - the input on which the action has to be performed
   * @param {any} actionFn - the action function to be called
   * @memberof LogsInputsCtrl
   */
  executeAction(input, actionFn) {
    this.setInputToProcessing(input);
    this.processInput = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsInputsService[actionFn](this.serviceName, input).finally(() =>
          this.CucControllerHelper.scrollPageToTop(),
        ),
    });
    this.processInput
      .load()
      .finally(() => this.reloadInputDetail(input.info.inputId));
  }

  /**
   * initializes the inputs
   *
   * @memberof LogsInputsCtrl
   */
  initLoaders() {
    this.inputs = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.LogsInputsService.getInputs(this.serviceName),
    });
  }

  /**
   * Updates the list of inputs with the latest information of the input
   *
   * @param {any} inputId
   * @returns promise which will be resolve with the reloaded input
   * @memberof LogsInputsCtrl
   */
  reloadInputDetail(inputId) {
    this.inputReload = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsInputsService.getInputDetail(this.serviceName, inputId),
    });

    return this.inputReload.load().then((input) => {
      this.inputs.data.forEach((inputItem, inputIndex) => {
        if (inputItem.info.inputId === input.info.inputId) {
          this.inputs.data[inputIndex] = input;
        }
      });
      return input;
    });
  }

  /**
   * Runs all the loaders to fetch data from APIs
   *
   * @memberof LogsInputsCtrl
   */
  runLoaders() {
    this.inputs.load();
  }

  /**
   * Sets the state of the input to Processing
   *
   * @param {any} input
   * @memberof LogsInputsCtrl
   */
  setInputToProcessing(input) {
    set(input, 'info.status', this.LogsConstants.inputStatus.PROCESSING);
    this.LogsInputsService.transformInput(input);
  }

  /**
   * navigates to the add page
   *
   * @memberof LogsInputsCtrl
   */
  add() {
    this.CucCloudMessage.flushChildMessage();
    this.$state.go('dbaas-logs.detail.inputs.addwizard.add', {
      serviceName: this.serviceName,
    });
  }

  /**
   * navigates to the edit page
   *
   * @param {any} input - the input for which standard output is to be edited
   * @memberof LogsInputsCtrl
   */
  edit(input) {
    this.CucCloudMessage.flushChildMessage();
    this.$state.go('dbaas-logs.detail.inputs.editwizard.edit', {
      serviceName: this.serviceName,
      inputId: input.info.inputId,
    });
  }

  /**
   * Opens the info pop-up for the input
   *
   * @param {any} input - the input for which info is to be displayed
   * @memberof LogsInputsCtrl
   */
  info(input) {
    this.CucCloudMessage.flushChildMessage();
    this.CucControllerHelper.modal.showModal({
      modalConfig: {
        template,
        controller: 'LogsInputsHomeInfoModalCtrl',
        controllerAs: 'ctrl',
        resolve: {
          currentInput: () => input,
        },
      },
    });
  }

  /**
   * Shows the confirmation modal box for input deletion confirmation
   * and deletes the input if the user confirms the deletion
   *
   * @param {any} input - the input object
   * @memberof LogsInputsCtrl
   */
  showDeleteConfirm(input) {
    this.CucCloudMessage.flushChildMessage();
    return this.CucControllerHelper.modal
      .showDeleteModal({
        titleText: this.$translate.instant('inputs_delete'),
        textHtml: this.$translate.instant('inputs_delete_message', {
          input: input.info.title,
        }),
      })
      .then(() => this.delete(input));
  }

  /**
   * Restarts the input
   *
   * @param {any} input - the input to be restarted
   * @memberof LogsInputsCtrl
   */
  restartInput(input) {
    this.CucCloudMessage.info(
      this.$translate.instant('inputs_restarting', {
        inputTitle: input.info.title,
      }),
    );
    this.executeAction(input, 'restartInput');
  }

  /**
   * navigates to the standard output page
   *
   * @param {any} input - the input for which standard output is to be displayed
   * @memberof LogsInputsCtrl
   */
  standardOutput(input) {
    this.CucCloudMessage.flushChildMessage();
    this.$state.go('dbaas-logs.detail.inputs.console', {
      serviceName: this.serviceName,
      inputId: input.info.inputId,
    });
  }

  /**
   * Starts the input
   *
   * @param {any} input - the input to be started
   * @memberof LogsInputsCtrl
   */
  startInput(input) {
    this.CucCloudMessage.info(
      this.$translate.instant('inputs_starting', {
        inputTitle: input.info.title,
      }),
    );
    this.executeAction(input, 'startInput');
  }

  /**
   * Stops the input
   *
   * @param {any} input - the input to be stopped
   * @memberof LogsInputsCtrl
   */
  stopInput(input) {
    this.CucCloudMessage.info(
      this.$translate.instant('inputs_stopping', {
        inputTitle: input.info.title,
      }),
    );
    this.executeAction(input, 'stopInput');
  }
}
