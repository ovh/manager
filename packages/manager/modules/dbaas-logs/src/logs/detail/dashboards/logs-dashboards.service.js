export default class LogsDashboardsService {
  /* @ngInject */
  constructor(
    $http,
    $q,
    LogsHelperService,
    LogsConstants,
    CucUrlHelper,
    iceberg,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.LogsHelperService = LogsHelperService;
    this.LogsConstants = LogsConstants;
    this.CucUrlHelper = CucUrlHelper;
    this.iceberg = iceberg;
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
      .then(({ data = [] }) => data.filter((dashboard) => dashboard.isEditable))
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
    return this.iceberg(`/dbaas/logs/${serviceName}/output/graylog/dashboard`)
      .query()
      .expand('CachedObjectList-Pages')
      .limit(10000)
      .execute().$promise;
  }

  getPaginatedDashboards(
    serviceName,
    offset = 0,
    pageSize = 25,
    sort = { name: 'title', dir: 'desc' },
    filters = null,
  ) {
    let res = this.iceberg(
      `/dbaas/logs/${serviceName}/output/graylog/dashboard`,
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
      data: response.data,
      meta: {
        totalCount:
          parseInt(response.headers['x-pagination-elements'], 10) || 0,
      },
    }));
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
    return this.$http
      .get(`/dbaas/logs/${serviceName}/output/graylog/dashboard/${dashboardId}`)
      .catch((err) =>
        this.LogsHelperService.handleError(
          'logs_dashboards_get_detail_error',
          err,
          {},
        ),
      );
  }

  getLastUpdatedDashboard(serviceName) {
    return this.getOwnDashboards(serviceName).then((dashboards) => {
      let lastUpdatedDashboard = null;
      if (dashboards.length > 0) {
        [lastUpdatedDashboard] = dashboards;
      }
      return lastUpdatedDashboard;
    });
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
    return this.$http
      .delete(
        `/dbaas/logs/${serviceName}/output/graylog/dashboard/${dashboard.dashboardId}`,
      )
      .then((operation) => {
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
          {
            dashboardName: dashboard.title,
          },
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
    return this.$http
      .post(`/dbaas/logs/${serviceName}/output/graylog/dashboard`, {
        description: dashboard.description,
        title: dashboard.title,
      })
      .then((operation) => {
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
          {
            dashboardName: dashboard.title,
          },
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
    return this.$http
      .post(
        `/dbaas/logs/${serviceName}/output/graylog/dashboard/${dashboardId}/duplicate`,
        this.constructor.transformDashboardToDuplicate(dashboard),
      )
      .then((operation) => {
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
          {
            dashboardName: dashboard.title,
          },
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
    return this.$http
      .put(
        `/dbaas/logs/${serviceName}/output/graylog/dashboard/${dashboard.dashboardId}`,
        {
          title: dashboard.title,
          description: dashboard.description,
        },
      )
      .then((operation) => {
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
          {
            dashboardName: dashboard.title,
          },
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
   * extracts graylog URL from dashboard. Shows error message on UI if no graylog URL is found.
   *
   * @param {any} dashboard
   * @returns {string} graylog url, if not found empty string
   * @memberof LogsDashboardsService
   */
  getDashboardGraylogUrl(serviceName, dashboard) {
    return this.$http
      .get(
        `/dbaas/logs/${serviceName}/output/graylog/dashboard/${dashboard.dashboardId}/url`,
      )
      .then(({ data: urls }) => {
        const url = this.CucUrlHelper.constructor.findUrl(
          { urls },
          this.LogsConstants.GRAYLOG_WEBUI,
        );
        if (!url) {
          this.LogsHelperService.handleError(
            'logs_dashboards_get_graylog_url_error',
            {},
            { dashboardName: dashboard.title },
          );
        }
        return url;
      });
  }

  static transformDashboardToDuplicate(dashboard) {
    const toDuplicate = {
      description: dashboard.description,
      streamId: dashboard.streamId,
      title: dashboard.title,
    };
    if (!dashboard.streamId) {
      delete toDuplicate.streamId;
    }
    return toDuplicate;
  }
}
