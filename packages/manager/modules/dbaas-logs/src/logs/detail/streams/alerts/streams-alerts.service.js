export default class LogsStreamsAlertsService {
  /* @ngInject */
  constructor(
    $q,
    CucCloudPoll,
    OvhApiDbaas,
    CucServiceHelper,
    LogsConstants,
    LogsHelperService,
  ) {
    this.$q = $q;
    this.CucCloudPoll = CucCloudPoll;
    this.OperationApiService = OvhApiDbaas.Logs()
      .Operation()
      .v6();
    this.AlertsApiService = OvhApiDbaas.Logs()
      .Alert()
      .v6();
    this.CucServiceHelper = CucServiceHelper;
    this.LogsConstants = LogsConstants;
    this.LogsHelperService = LogsHelperService;
  }

  /**
   * Adds a new alert
   *
   * @param {any} serviceName
   * @param {any} streamId
   * @param {any} alert - the alert object
   * @returns promise which will be resolve to an operation object
   * @memberof LogsStreamsAlertsService
   */
  addAlert(serviceName, streamId, alert) {
    return this.AlertsApiService.post(
      { serviceName, streamId },
      {
        backlog: alert.backlog,
        conditionType: alert.conditionType,
        constraintType: alert.constraintType,
        field: alert.field,
        grace: alert.grace,
        queryFilter: alert.queryFilter,
        repeatNotificationsEnabled: alert.repeatNotificationsEnabled,
        threshold: alert.threshold,
        thresholdType: alert.thresholdType,
        time: alert.time,
        title: alert.title,
        value: alert.value,
      },
    )
      .$promise.then((operation) =>
        this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'streams_alerts_add_success',
          { alertName: alert.title },
        ),
      )
      .catch((err) =>
        this.LogsHelperService.handleError('streams_alerts_add_error', err, {
          alertName: alert.title,
        }),
      );
  }

  /**
   * Deletes an alert
   *
   * @param {any} serviceName
   * @param {any} streamId
   * @param {any} alert - alert to be deleted
   * @returns promise which will be resolve to an operation object
   * @memberof LogsStreamsAlertsService
   */
  deleteAlert(serviceName, streamId, alert) {
    return this.AlertsApiService.delete({
      serviceName,
      streamId,
      alertId: alert.alertId,
    })
      .$promise.then((operation) =>
        this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'streams_alerts_delete_success',
          { alertName: alert.title },
        ),
      )
      .catch((err) =>
        this.LogsHelperService.handleError('streams_alerts_delete_error', err, {
          alertName: alert.title,
        }),
      );
  }

  /**
   * Get the IDs of all alerts
   *
   * @param {any} serviceName
   * @param {any} streamId
   * @returns promise which will be resolve with a list of alert IDs
   * @memberof LogsStreamsAlertsService
   */
  getAlertIds(serviceName, streamId) {
    return this.AlertsApiService.query({
      serviceName,
      streamId,
    }).$promise.catch((err) =>
      this.LogsHelperService.handleError(
        'streams_alerts_ids_loading_error',
        err,
        {},
      ),
    );
  }

  /**
   * Gets the alert objects corresponding to the alertIds
   *
   * @param {any} serviceName
   * @param {any} streamId
   * @param {any} alertIds - list of alert IDs for which alert object is to be fetched
   * @returns promise which will be resolve with the list of alerts
   * @memberof LogsStreamsAlertsService
   */
  getAlerts(serviceName, streamId, alertIds) {
    return this.getAlertDetails(serviceName, streamId, alertIds).catch((err) =>
      this.LogsHelperService.handleError(
        'streams_alerts_loading_error',
        err,
        {},
      ),
    );
  }

  /**
   * Gets the alert objects corresponding to the alertIds
   *
   * @param {any} serviceName
   * @param {any} streamId
   * @param {any} alertIds - list of alert IDs for which alert object is to be fetched
   * @returns promise which will be resolve with the list of alerts
   * @memberof LogsStreamsAlertsService
   */
  getAlertDetails(serviceName, streamId, alertIds) {
    const promises = alertIds.map((alertId) =>
      this.getAlert(serviceName, streamId, alertId),
    );
    return this.$q.all(promises);
  }

  /**
   * Gets the alert object corresponding to the alertId
   *
   * @param {any} serviceName
   * @param {any} streamId
   * @param {any} alertId - the alert ID for which alert object is to be fetched
   * @returns promise which will be resolve with the alert
   * @memberof LogsStreamsAlertsService
   */
  getAlert(serviceName, streamId, alertId) {
    return this.AlertsApiService.get({
      serviceName,
      streamId,
      alertId,
    }).$promise.then((alert) => this.constructor.transformAlert(alert));
  }

  /**
   * Returns a new alert object with the default properties
   *
   * @param {any} conditionType - the type of the condition (one of LogsConstants.alertType)
   * @returns the default alert object
   * @memberof LogsStreamsAlertsService
   */
  getNewAlert(conditionType) {
    const thresholdType =
      conditionType === this.LogsConstants.alertType.numeric
        ? this.LogsConstants.thresholdType.lower
        : this.LogsConstants.thresholdType.more;
    const constraintType = this.LogsConstants.constraintType.mean;
    return this.$q.when({
      data: {
        conditionType,
        thresholdType,
        threshold: 1,
        time: 1,
        grace: 1,
        backlog: 1,
        repeatNotificationsEnabled: false,
        constraintType,
        queryFilter: '*',
      },
      loading: false,
    });
  }

  /**
   * Edit and save an alert
   *
   * @param {any} serviceName
   * @param {any} streamId
   * @param {any} alert - the alert object
   * @returns promise which will be resolve to an operation object
   * @memberof LogsStreamsAlertsService
   */
  updateAlert(serviceName, streamId, alert) {
    return this.AlertsApiService.put(
      { serviceName, streamId, alertId: alert.alertId },
      {
        backlog: alert.backlog,
        conditionType: alert.conditionType,
        constraintType: alert.constraintType,
        field: alert.field,
        grace: alert.grace,
        queryFilter: alert.queryFilter,
        repeatNotificationsEnabled: alert.repeatNotificationsEnabled,
        threshold: alert.threshold,
        thresholdType: alert.thresholdType,
        time: alert.time,
        title: alert.title,
        value: alert.value,
      },
    )
      .$promise.then((operation) =>
        this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'streams_alerts_update_success',
          { alertName: alert.title },
        ),
      )
      .catch((err) =>
        this.LogsHelperService.handleError('streams_alerts_update_error', err, {
          alertName: alert.title,
        }),
      );
  }

  /**
   * Applies transformation to the alert
   *
   * @param {any} alert - the alert object
   * @returns the transformed alert
   * @memberof LogsStreamsAlertsService
   */
  static transformAlert(alert) {
    Object.keys(alert).forEach((property) => {
      if (alert[property] === null) {
        // eslint-disable-next-line no-param-reassign
        alert[property] = undefined;
      }
    });
    return alert;
  }
}
