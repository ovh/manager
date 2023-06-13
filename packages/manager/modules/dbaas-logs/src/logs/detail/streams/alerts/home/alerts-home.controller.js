import datagridToIcebergFilter from '../../../logs-iceberg.utils';

export default class LogsStreamsAlertsHomeCtrl {
  /* @ngInject */
  constructor(
    $state,
    $stateParams,
    $translate,
    ouiDatagridService,
    CucCloudMessage,
    CucControllerHelper,
    LogsStreamsService,
    LogsConstants,
    LogsStreamsAlertsService,
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.ouiDatagridService = ouiDatagridService;
    this.CucCloudMessage = CucCloudMessage;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsStreamsService = LogsStreamsService;
    this.LogsConstants = LogsConstants;
    this.LogsStreamsAlertsService = LogsStreamsAlertsService;

    this.serviceName = this.$stateParams.serviceName;
    this.streamId = this.$stateParams.streamId;

    this.alertConditions = [
      {
        id: 'counter',
        conditionName: this.$translate.instant('counter_alert'),
      },
      {
        id: 'numeric',
        conditionName: this.$translate.instant('numeric_alert'),
      },
      {
        id: 'textual',
        conditionName: this.$translate.instant('textual_alert'),
      },
    ];

    this.initLoaders();
  }

  $onInit() {
    this.runLoaders();
  }

  back() {
    this.$state.go('dbaas-logs.detail.streams');
  }

  /**
   * Runs all the loaders to fetch data from APIs
   *
   * @memberof LogsStreamsAlertsHomeCtrl
   */
  runLoaders() {
    this.stream.load();
  }

  /**
   * initializes the alertsIDs and current stream
   *
   * @memberof LogsStreamsAlertsHomeCtrl
   */
  initLoaders() {
    this.stream = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsStreamsService.getStream(this.serviceName, this.streamId),
    });
  }

  /**
   * Loads a number of alerts specified by the pageSize, starting from the specified offset
   *
   * @param {any} offset
   * @param {any} pageSize
   * @returns promise which will be resolve to the loaded alerts data
   * @memberof LogsStreamsAlertsHomeCtrl
   */
  loadAlerts({ offset, pageSize = 1, sort, criteria }) {
    const filters = criteria.map((criterion) => {
      const name = criterion.property || 'title';
      return datagridToIcebergFilter(name, criterion.operator, criterion.value);
    });
    const pageOffset = Math.ceil(offset / pageSize);
    return this.LogsStreamsAlertsService.getPaginatedAlerts(
      this.serviceName,
      this.streamId,
      pageOffset,
      pageSize,
      { name: sort.property, dir: sort.dir === -1 ? 'DESC' : 'ASC' },
      filters,
    );
  }

  /**
   * Shows the confirmation modal box for alert deletion confirmation
   * and deletes the alert if the user confirms the deletion
   *
   * @param {any} alert - the alert object
   * @memberof LogsStreamsAlertsHomeCtrl
   */
  showDeleteConfirm(alert) {
    this.CucCloudMessage.flushChildMessage();
    return this.CucControllerHelper.modal
      .showDeleteModal({
        titleText: this.$translate.instant('streams_alerts_delete'),
        textHtml: this.$translate.instant('streams_alerts_delete_message', {
          alert: alert.title,
        }),
      })
      .then(() => this.remove(alert));
  }

  /**
   * Deletes the alert
   *
   * @param {any} alert - the alert object
   * @memberof LogsStreamsAlertsHomeCtrl
   */
  remove(alert) {
    this.delete = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsStreamsAlertsService.deleteAlert(
          this.serviceName,
          this.streamId,
          alert,
        ).finally(() => {
          this.ouiDatagridService.refresh('alerts-datagrid', true);
        }),
    });
    this.delete.load();
  }

  /**
   * Redirects to the new alert add page
   *
   * @param {any} type - the type of the alert to add
   * @memberof LogsStreamsAlertsHomeCtrl
   */
  addAlert(type) {
    this.$state.go('dbaas-logs.detail.streams.stream.alerts.add', {
      serviceName: this.serviceName,
      streamId: this.streamId,
      type: this.LogsConstants.alertType[type],
    });
  }

  /**
   * Redirects to the alert edit page
   *
   * @param {any} alert
   * @memberof LogsStreamsAlertsHomeCtrl
   */
  editAlert(alert) {
    this.$state.go('dbaas-logs.detail.streams.stream.alerts.alert.edit', {
      serviceName: this.serviceName,
      streamId: this.streamId,
      alertId: alert.alertId,
    });
  }

  /**
   * Return human friendly threshold type translation
   *
   * @param {any} thresholdType
   * @memberof LogsStreamsAlertsHomeCtrl
   */
  getThresholdType(thresholdType) {
    if (thresholdType) {
      return this.$translate
        .instant(`add_alert_threshold_type_${thresholdType.toLowerCase()}`)
        .toLowerCase();
    }
    return thresholdType;
  }
}
