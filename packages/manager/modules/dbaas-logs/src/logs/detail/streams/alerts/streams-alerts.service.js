export default class LogsStreamsAlertsService {
  /* @ngInject */
  constructor(
    $q,
    $http,
    iceberg,
    CucCloudPoll,
    CucServiceHelper,
    LogsConstants,
    LogsHelperService,
  ) {
    this.$q = $q;
    this.$http = $http;
    this.iceberg = iceberg;
    this.CucCloudPoll = CucCloudPoll;
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
    return this.$http
      .post(
        `/dbaas/logs/${serviceName}/output/graylog/stream/${streamId}/alert`,
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
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'streams_alerts_add_success',
          { alertName: alert.title },
        );
      })
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
    return this.$http
      .delete(
        `/dbaas/logs/${serviceName}/output/graylog/stream/${streamId}/alert/${alert.alertId}`,
      )
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'streams_alerts_delete_success',
          { alertName: alert.title },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('streams_alerts_delete_error', err, {
          alertName: alert.title,
        }),
      );
  }

  getPaginatedAlerts(
    serviceName,
    streamId,
    offset = 0,
    pageSize = 25,
    sort = { name: 'title', dir: 'desc' },
    filters = null,
  ) {
    let res = this.iceberg(
      `/dbaas/logs/${serviceName}/output/graylog/stream/${streamId}/alert`,
    )
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
      data: response.data.map((alert) =>
        this.constructor.transformAlert(alert),
      ),
      meta: {
        totalCount:
          parseInt(response.headers['x-pagination-elements'], 10) || 0,
      },
    }));
  }

  getAlert(serviceName, streamId, alertId) {
    return this.$http
      .get(
        `/dbaas/logs/${serviceName}/output/graylog/stream/${streamId}/alert/${alertId}`,
      )
      .then((alert) => {
        return alert.data;
      });
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
    return this.$http
      .put(
        `/dbaas/logs/${serviceName}/output/graylog/stream/${streamId}/alert/${alert.alertId}`,
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
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'streams_alerts_update_success',
          { alertName: alert.title },
        );
      })
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
