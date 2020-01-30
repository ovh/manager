class LogsDashboardsService {
  constructor(
    $q,
    OvhApiDbaas,
    LogsOptionsService,
    LogsHelperService,
    LogsConstants,
    CucUrlHelper,
  ) {
    this.$q = $q;
    this.DashboardsApiService = OvhApiDbaas.Logs()
      .Dashboard()
      .v6();
    this.DashboardsAapiService = OvhApiDbaas.Logs()
      .Dashboard()
      .Aapi();
    this.AccountingAapiService = OvhApiDbaas.Logs()
      .Accounting()
      .Aapi();
    this.DetailsAapiService = OvhApiDbaas.Logs()
      .Details()
      .Aapi();
    this.LogsOptionsService = LogsOptionsService;
    this.LogsHelperService = LogsHelperService;
    this.LogsConstants = LogsConstants;
    this.CucUrlHelper = CucUrlHelper;
  }

  /**
   * returns array of dashboards with details
   *
   * @param {any} serviceName
   * @returns promise which will be resolve to array of dashboards.
   *          Each Dashboard will have all details populated.
   * @memberof LogsDashboardsService
   */
  getDashboards(serviceName) {
    return this.getDashboardsDetails(serviceName).catch((err) =>
      this.LogsHelperService.handleError('logs_dashboards_get_error', err, {}),
    );
  }

  /**
   * returns array of owned dashboards with details of logged in user
   *
   * @param {any} serviceName
   * @returns promise which will be resolve to array of dashboards.
   *          Each stream will have all details populated.
   * @memberof LogsStreamsService
   */
  getOwnDashboards(serviceName) {
    return this.getDashboardsDetails(serviceName)
      .then((dashboards) =>
        dashboards.filter((dashboard) => dashboard.info.isEditable),
      )
      .catch((err) =>
        this.LogsHelperService.handleError(
          'logs_dashboards_get_error',
          err,
          {},
        ),
      );
  }

  /**
   * returns array of shareable dashboards with details of logged in user
   *
   * @param {any} serviceName
   * @returns promise which will be resolve to array of dashboards.
   *          Each stream will have all details populated.
   * @memberof LogsStreamsService
   */
  getShareableDashboards(serviceName) {
    return this.getDashboardsDetails(serviceName)
      .then((dashboards) =>
        dashboards.filter((dashboard) => dashboard.info.isShareable),
      )
      .catch((err) =>
        this.LogsHelperService.handleError(
          'logs_dashboards_get_error',
          err,
          {},
        ),
      );
  }

  /**
   * gets details for each dashboard in array
   *
   * @param {any} serviceName
   * @returns promise which will be resolve to an array of dashboard objects
   * @memberof LogsDashboardsService
   */
  getDashboardsDetails(serviceName) {
    return this.getDashboardsIds(serviceName).then((dashboards) => {
      const promises = dashboards.map((dashboardId) =>
        this.getAapiDashboard(serviceName, dashboardId),
      );
      return this.$q.all(promises);
    });
  }

  /**
   * returns array of dashboards id's of logged in user
   *
   * @param {any} serviceName
   * @returns promise which will be resolve to array of dashboards id's
   * @memberof LogsDashboardsService
   */
  getDashboardsIds(serviceName) {
    return this.DashboardsApiService.query({ serviceName }).$promise;
  }

  /**
   * returns details of an dashboard
   *
   * @param {any} serviceName
   * @param {any} dashboardId
   * @returns promise which will be resolve to dashboard object
   * @memberof LogsDashboardsService
   */
  getDashboard(serviceName, dashboardId) {
    return this.DashboardsApiService.get({
      serviceName,
      dashboardId,
    }).$promise.catch((err) =>
      this.LogsHelperService.handleError(
        'logs_dashboards_get_detail_error',
        err,
        {},
      ),
    );
  }

  /**
   * returns details of an dashboard
   *
   * @param {any} serviceName
   * @param {any} dashboardId
   * @returns promise which will be resolve to dashboard object
   * @memberof LogsDashboardsService
   */
  getAapiDashboard(serviceName, dashboardId) {
    return this.DashboardsAapiService.get({
      serviceName,
      dashboardId,
    }).$promise.catch((err) =>
      this.LogsHelperService.handleError(
        'logs_dashboards_get_detail_error',
        err,
        {},
      ),
    );
  }

  /**
   * returns objecy containing total number of dashboards and total number of dashboards used
   *
   * @param {any} serviceName
   * @returns quota object containing max (total number dashboards)
   *          and configured (number of dashboards used)
   * @memberof LogsDashboardsService
   */
  getQuota(serviceName) {
    return this.AccountingAapiService.me({ serviceName })
      .$promise.then((me) => ({
        max: me.total.maxNbDashboard,
        configured: me.total.curNbDashboard,
        reference: me.total.reference,
      }))
      .catch((err) =>
        this.LogsHelperService.handleError(
          'logs_dashboards_quota_get_error',
          err,
          {},
        ),
      );
  }

  /**
   * Retrieves options associated with main offer
   * @param {string} serviceName
   */
  getMainOffer(serviceName) {
    return this.AccountingAapiService.me({ serviceName })
      .$promise.then((me) => ({
        max: me.offer.maxNbDashboard,
        current: me.offer.curNbDashboard,
      }))
      .catch((err) =>
        this.LogsHelperService.handleError(
          'logs_main_offer_get_error',
          err,
          {},
        ),
      );
  }

  /**
   * delete dashboard
   *
   * @param {any} serviceName
   * @param {any} Dashboard, dashboard object to be deleted
   * @returns promise which will be resolve to operation object
   * @memberof LogsDashboardsService
   */
  deleteDashboard(serviceName, dashboard) {
    return this.DashboardsApiService.delete({
      serviceName,
      dashboardId: dashboard.dashboardId,
    })
      .$promise.then((operation) => {
        this.resetAllCache();
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_dashboards_delete_success',
          { dashboardName: dashboard.title },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError(
          'logs_dashboards_delete_error',
          err,
          { dashboardName: dashboard.title },
        ),
      );
  }

  /**
   * create new dashboard
   *
   * @param {any} serviceName
   * @param {any} Dashboard, dashboard object to be created
   * @returns promise which will be resolve to operation object
   * @memberof LogsDashboardsService
   */
  createDashboard(serviceName, dashboard) {
    return this.DashboardsApiService.create(
      { serviceName },
      {
        description: dashboard.description,
        optionId: dashboard.optionId,
        title: dashboard.title,
      },
    )
      .$promise.then((operation) => {
        this.resetAllCache();
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_dashboards_create_success',
          { dashboardName: dashboard.title },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError(
          'logs_dashboards_create_error',
          err,
          { dashboardName: dashboard.title },
        ),
      );
  }

  /**
   * create new dashboard from another dashboard
   *
   * @param {any} serviceName
   * @param {any} Dashboard, dashboard object to be created
   * @returns promise which will be resolve to operation object
   * @memberof LogsDashboardsService
   */
  duplicateDashboard(serviceName, dashboard, dashboardId) {
    return this.DashboardsApiService.duplicate(
      { serviceName, dashboardId },
      this.constructor.transformDashboardToDuplicate(dashboard),
    )
      .$promise.then((operation) => {
        this.resetAllCache();
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_dashboards_create_success',
          { dashboardName: dashboard.title },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError(
          'logs_dashboards_create_error',
          err,
          { dashboardName: dashboard.title },
        ),
      );
  }

  /**
   * update dashboard
   *
   * @param {any} serviceName
   * @param {any} Dashboard, dashboard object to be updated
   * @returns promise which will be resolve to operation object
   * @memberof LogsDashboardsService
   */
  updateDashboard(serviceName, dashboard) {
    return this.DashboardsApiService.update(
      { serviceName, dashboardId: dashboard.dashboardId },
      {
        title: dashboard.title,
        description: dashboard.description,
        optionId: dashboard.optionId,
      },
    )
      .$promise.then((operation) => {
        this.resetAllCache();
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_dashboards_update_success',
          { dashboardName: dashboard.title },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError(
          'logs_dashboards_update_error',
          err,
          { dashboardName: dashboard.title },
        ),
      );
  }

  /**
   * creates new dashboard with default values
   *
   * @returns dashboard object with default values
   * @memberof LogsDashboardsService
   */
  static getNewDashboard() {
    return {
      data: {
        description: null,
        title: null,
      },
      loading: false,
    };
  }

  /**
   * retrives all subscribed options of type dashboards
   * @param {string} serviceName
   */
  getSubscribedOptions(serviceName) {
    return this.LogsOptionsService.getSubscribedOptionsByType(
      serviceName,
      this.LogsConstants.DASHBOARD_OPTION_REFERENCE,
    );
  }

  /**
   * extracts graylog URL from dashboard. Shows error message on UI if no graylog URL is found.
   *
   * @param {any} dashboard
   * @returns {string} graylog url, if not found empty string
   * @memberof LogsDashboardsService
   */
  getDashboardGraylogUrl(aapiDashboard) {
    const url = this.CucUrlHelper.constructor.findUrl(
      aapiDashboard,
      this.LogsConstants.GRAYLOG_WEBUI,
    );
    if (!url) {
      this.LogsHelperService.handleError(
        'logs_dashboards_get_graylog_url_error',
        {},
        { dashboardName: aapiDashboard.info.title },
      );
    }
    return url;
  }

  static transformDashboardToDuplicate(dashboard) {
    const toDuplicate = {
      description: dashboard.description,
      optionId: dashboard.optionId,
      streamId: dashboard.streamId,
      title: dashboard.title,
    };
    if (!dashboard.streamId) {
      delete toDuplicate.streamId;
    }
    return toDuplicate;
  }

  resetAllCache() {
    this.AccountingAapiService.resetAllCache();
    this.DashboardsApiService.resetAllCache();
    this.DashboardsAapiService.resetAllCache();
    // refresh home page last modified dashboard
    this.DetailsAapiService.resetAllCache();
  }
}

angular
  .module('managerApp')
  .service('LogsDashboardsService', LogsDashboardsService);
