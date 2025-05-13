import set from 'lodash/set';
import datagridToIcebergFilter from '../../logs-iceberg.utils';
import template from './info/logs-inputs-home-info.html';

export default class LogsInputsHomeCtrl {
  /* @ngInject */
  constructor(
    $state,
    $stateParams,
    $translate,
    ouiDatagridService,
    CucCloudMessage,
    CucControllerHelper,
    LogsConstants,
    LogsInputsService,
    LogsTokensService,
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.$translate = $translate;
    this.ouiDatagridService = ouiDatagridService;
    this.CucCloudMessage = CucCloudMessage;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsConstants = LogsConstants;
    this.LogsInputsService = LogsInputsService;
    this.LogsTokensService = LogsTokensService;
  }

  loadInputs({ offset, pageSize = 1, sort, criteria }) {
    const filters = criteria.map((criterion) => {
      const name = criterion.property || 'title';
      return datagridToIcebergFilter(name, criterion.operator, criterion.value);
    });
    const pageOffset = Math.ceil(offset / pageSize);
    return this.LogsInputsService.getPaginatedInputs(
      this.serviceName,
      pageOffset,
      pageSize,
      { name: sort.property, dir: sort.dir === -1 ? 'DESC' : 'ASC' },
      filters,
    );
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
        this.LogsInputsService.deleteInput(this.serviceName, input).finally(
          () => {
            this.ouiDatagridService.refresh('inputs-datagrid', true);
            this.CucControllerHelper.scrollPageToTop();
          },
        ),
    });
    this.delete.load();
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
      .finally(() => this.reloadInputDetail(input.inputId));
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
        this.LogsInputsService.getInputDetail(this.serviceName, inputId, false),
    });

    return this.inputReload.load().then((input) => {
      this.inputs.data.forEach((inputItem, inputIndex) => {
        if (inputItem.inputId === input.inputId) {
          this.inputs.data[inputIndex] = input;
        }
      });
      return input;
    });
  }

  /**
   * Sets the state of the input to Processing
   *
   * @param {any} input
   * @memberof LogsInputsCtrl
   */
  setInputToProcessing(input) {
    set(input, 'status', this.LogsConstants.inputStatus.PROCESSING);
    this.LogsInputsService.transformInput(input, false);
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
    this.$state.go('dbaas-logs.detail.inputs.input.editwizard.edit', {
      serviceName: this.serviceName,
      inputId: input.inputId,
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
          defaultCluster: () =>
            this.LogsTokensService.getDefaultCluster(this.serviceName),
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
          input: input.title,
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
        inputTitle: input.title,
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
    this.$state.go('dbaas-logs.detail.inputs.input.console', {
      serviceName: this.serviceName,
      inputId: input.inputId,
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
        inputTitle: input.title,
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
        inputTitle: input.title,
      }),
    );
    this.executeAction(input, 'stopInput');
  }
}
