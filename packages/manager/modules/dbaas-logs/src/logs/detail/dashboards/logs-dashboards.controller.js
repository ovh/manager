import datagridToIcebergFilter from '../logs-iceberg.utils';

export default class LogsDashboardsCtrl {
  /* @ngInject */
  constructor(
    $state,
    $stateParams,
    $translate,
    $window,
    ouiDatagridService,
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
    this.$window = $window;
    this.ouiDatagridService = ouiDatagridService;
    this.LogsDashboardsService = LogsDashboardsService;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.LogsConstants = LogsConstants;
    this.CucControllerModalHelper = CucControllerModalHelper;
  }

  loadDashboards({ offset, pageSize = 1, sort, criteria }) {
    const filters = criteria.map((criterion) => {
      const name = criterion.property || 'title';
      return datagridToIcebergFilter(name, criterion.operator, criterion.value);
    });
    const pageOffset = Math.ceil(offset / pageSize);
    return this.LogsDashboardsService.getPaginatedDashboards(
      this.serviceName,
      pageOffset,
      pageSize,
      { name: sort.property, dir: sort.dir === -1 ? 'DESC' : 'ASC' },
      filters,
    );
  }

  /**
   * navigates to add dashboard page
   *
   * @memberof LogsDashboardsCtrl
   */
  add() {
    this.$state.go('dbaas-logs.detail.dashboards.add', {
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
    this.$state.go('dbaas-logs.detail.dashboards.dashboard.edit', {
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
    this.$state.go('dbaas-logs.detail.dashboards.dashboard.duplicate', {
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
      .then(() => this.remove(dashboard));
  }

  /**
   * delete dashboard
   *
   * @param {any} dashboard to delete
   * @memberof LogsDashboardsCtrl
   */
  remove(dashboard) {
    this.delete = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsDashboardsService.deleteDashboard(
          this.serviceName,
          dashboard,
        ).finally(() => {
          this.ouiDatagridService.refresh('dashboards-datagrid', true);
          this.CucControllerHelper.scrollPageToTop();
        }),
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
  openGrayLog(dashboard) {
    return this.LogsDashboardsService.getDashboardGraylogUrl(
      this.serviceName,
      dashboard,
    ).then((url) => {
      this.$window.open(url, '_blank');
    });
  }
}
