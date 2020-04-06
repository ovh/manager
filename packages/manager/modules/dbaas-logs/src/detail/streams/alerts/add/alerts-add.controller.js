export default class LogsStreamsAlertsAddCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $window,
    CucCloudMessage,
    CucControllerHelper,
    DbaasLogsConstants,
    LogsStreamsAlertsService,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.serviceName = $stateParams.serviceName;
    this.streamId = $stateParams.streamId;
    this.alertId = $stateParams.alertId;
    this.alertType = $stateParams.type;
    this.editMode = Boolean(this.alertId);
    this.$window = $window;
    this.CucCloudMessage = CucCloudMessage;
    this.CucControllerHelper = CucControllerHelper;
    this.DbaasLogsConstants = DbaasLogsConstants;
    this.DbaasLogsConstants = DbaasLogsConstants;
    this.LogsStreamsAlertsService = LogsStreamsAlertsService;
  }

  $onInit() {
    if (this.editMode) {
      this.alert = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () =>
          this.LogsStreamsAlertsService.getAlert(
            this.serviceName,
            this.streamId,
            this.alertId,
          ),
      });
      this.alert.load().then((alert) => {
        this.alertType = alert.conditionType;
      });
    } else {
      this.LogsStreamsAlertsService.getNewAlert(this.alertType).then(
        (alert) => {
          this.alert = alert;
        },
      );
    }
  }

  /**
   * Adds a new alert by making an API call
   *
   * @memberof LogsStreamsAlertsAddCtrl
   */
  saveAlert() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }

    this.CucCloudMessage.flushChildMessage();
    this.savingAlert = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.editMode
          ? this.LogsStreamsAlertsService.updateAlert(
              this.serviceName,
              this.streamId,
              this.alert.data,
            )
          : this.LogsStreamsAlertsService.addAlert(
              this.serviceName,
              this.streamId,
              this.alert.data,
            ),
    });
    return this.savingAlert
      .load()
      .then(() => this.$state.go('dbaas-logs.detail.streams.alerts'));
  }

  /**
   * Cancels the Alert add operation and redirects
   * to the parent page
   *
   * @memberof LogsStreamsAlertsAddCtrl
   */
  cancel() {
    this.$state.go('dbaas-logs.detail.streams.alerts');
  }

  /**
   * Returns the valid threshold types based on the condition (alert) type
   *
   * @memberof LogsStreamsAlertsAddCtrl
   */
  getThresholdTypes() {
    if (this.alertType === this.DbaasLogsConstants.alertType.numeric) {
      return [
        this.DbaasLogsConstants.thresholdType.lower,
        this.DbaasLogsConstants.thresholdType.higher,
      ];
    }
    return [
      this.DbaasLogsConstants.thresholdType.more,
      this.DbaasLogsConstants.thresholdType.less,
    ];
  }

  /**
   * Returns the constraint types
   *
   * @memberof LogsStreamsAlertsAddCtrl
   */
  getConstraintTypes() {
    return Object.values(this.DbaasLogsConstants.constraintType);
  }
}
