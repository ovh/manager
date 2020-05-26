class LogsDashboardsCtrl {
  constructor(
    $state,
    $stateParams,
    $translate,
    LogsDashboardsService,
    CucControllerHelper,
    CucCloudMessage,
    LogsConstants,
    CucControllerModalHelper,
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.$translate = $translate;
    this.LogsDashboardsService = LogsDashboardsService;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.LogsConstants = LogsConstants;
    this.CucControllerModalHelper = CucControllerModalHelper;

    this.initLoaders();
  }

  /**
   * initializes dashboards object by making API call to get data
   *
   * @memberof LogsDashboardsCtrl
   */
  initLoaders() {
    this.dashboards = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsDashboardsService.getDashboards(this.serviceName),
    });
    this.dashboards.load();
  }

  /**
   * navigates to add dashboard page
   *
   * @memberof LogsDashboardsCtrl
   */
  add() {
    this.$state.go('dbaas.logs.detail.dashboards.add', {
      serviceName: this.serviceName,
    });
  }

  /**
   * navigates to edit dashboard page
   *
   * @param {any} dashboard
   * @memberof LogsDashboardsCtrl
   */
  edit(dashboard) {
    this.$state.go('dbaas.logs.detail.dashboards.edit', {
      serviceName: this.serviceName,
      dashboardId: dashboard.dashboardId,
    });
  }

  /**
   * navigates to duplicate dashboard page
   *
   * @param {any} dashboard
   * @memberof LogsDashboardsCtrl
   */
  duplicate(dashboard) {
    this.$state.go('dbaas.logs.detail.dashboards.duplicate', {
      serviceName: this.serviceName,
      dashboardId: dashboard.dashboardId,
      dashboardName: dashboard.title,
    });
  }

  /**
   * show delete dashboard confirmation modal
   *
   * @param {any} dashboard to delete
   * @memberof LogsDashboardsCtrl
   */
  showDeleteConfirm(dashboard) {
    this.CucCloudMessage.flushChildMessage();
    return this.CucControllerHelper.modal
      .showDeleteModal({
        titleText: this.$translate.instant('logs_dashboards_delete_title'),
        textHtml: this.$translate.instant('logs_dashboards_delete_message', {
          dashboardName: dashboard.title,
        }),
      })
      .then(() => this.delete(dashboard));
  }

  /**
   * delete dashboard
   *
   * @param {any} dashboard to delete
   * @memberof LogsDashboardsCtrl
   */
  delete(dashboard) {
    this.delete = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsDashboardsService.deleteDashboard(this.serviceName, dashboard)
          .then(() => this.initLoaders())
          .finally(() => this.CucControllerHelper.scrollPageToTop()),
    });
    this.delete.load();
  }

  /**
   * extracts graylog web URL from dashboard
   *
   * @param {any} dashboard, dashboard for which URL needs to be extracted
   * @return {string} graylog url
   * @memberof LogsDashboardsCtrl
   */
  getGraylogUrl(aapiDashboard) {
    return this.LogsDashboardsService.getDashboardGraylogUrl(aapiDashboard);
  }
}

angular
  .module('managerApp')
  .controller('LogsDashboardsCtrl', LogsDashboardsCtrl);
