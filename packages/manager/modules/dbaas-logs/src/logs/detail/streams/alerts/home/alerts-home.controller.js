export default class LogsStreamsAlertsHomeCtrl {
  /* @ngInject */
  constructor(
    $state,
    $stateParams,
    $translate,
    CucCloudMessage,
    CucControllerHelper,
    LogsStreamsService,
    LogsConstants,
    LogsStreamsAlertsService,
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
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
    this.alertIds.load();
    this.stream.load();
  }

  /**
   * initializes the alertsIDs and current stream
   *
   * @memberof LogsStreamsAlertsHomeCtrl
   */
  initLoaders() {
    this.alertIds = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsStreamsAlertsService.getAlertIds(
          this.serviceName,
          this.streamId,
        ),
    });
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
  loadAlerts({ offset, pageSize }) {
    this.alerts = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsStreamsAlertsService.getAlerts(
          this.serviceName,
          this.streamId,
          this.alertIds.data.slice(offset - 1, offset + pageSize - 1),
        ),
    });

    return this.alerts.load().then((alerts) => ({
      data: alerts,
      meta: {
        totalCount: this.alertIds.data.length,
      },
    }));
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
        ).then(() => this.runLoaders()),
    });
    this.alertIds.loading = true;
    this.delete.load();
  }

  /**
   * Redirects to the new alert add page
   *
   * @param {any} type - the type of the alert to add
   * @memberof LogsStreamsAlertsHomeCtrl
   */
  addAlert(type) {
    this.$state.go('dbaas-logs.detail.streams.alerts.add', {
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
    this.$state.go('dbaas-logs.detail.streams.alerts.edit', {
      serviceName: this.serviceName,
      streamId: this.streamId,
      alertId: alert.alertId,
    });
  }
}
