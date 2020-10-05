export default class LogsDashboardsCrudCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $uibModalInstance,
    LogsDashboardsService,
    CucControllerHelper,
    CucCloudMessage,
    LogsStreamsService,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$uibModalInstance = $uibModalInstance;
    this.serviceName = this.$stateParams.serviceName;
    this.LogsDashboardsService = LogsDashboardsService;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.LogsStreamsService = LogsStreamsService;
    this.isEdit = false;
    this.isDuplicate =
      $state.$current.name === 'dbaas-logs.detail.dashboards.duplicate';
    this.dashboardName = this.$stateParams.dashboardName;

    this.initLoaders();
  }

  /**
   * initializes options list
   *
   * @memberof LogsDashboardsCrudCtrl
   */
  initLoaders() {
    if (this.isDuplicate) {
      this.streams = this.CucControllerHelper.request.getArrayLoader({
        loaderFunction: () =>
          this.LogsStreamsService.getOwnStreams(this.serviceName),
      });
      this.streams.load();
      this.isEdit = false;
      this.title = 'logs_dashboards_duplicate_title';
      this.dashboard = this.LogsDashboardsService.constructor.getNewDashboard();
      if (!this.dashboardName) {
        this.CucControllerHelper.request
          .getHashLoader({
            loaderFunction: () =>
              this.LogsDashboardsService.getDashboard(
                this.serviceName,
                this.$stateParams.dashboardId,
              ).then((aapiDashboard) => {
                this.dashboardName = aapiDashboard.title;
                return aapiDashboard;
              }),
          })
          .load();
      }
    } else if (this.$stateParams.dashboardId) {
      this.isEdit = true;
      this.title = 'logs_dashboards_update_title';
      this.dashboard = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () =>
          this.LogsDashboardsService.getAapiDashboard(
            this.serviceName,
            this.$stateParams.dashboardId,
          ).then((dashboard) => dashboard.info),
      });
      this.dashboard.load();
    } else {
      this.isEdit = false;
      this.title = 'logs_dashboards_add';
      this.dashboard = this.LogsDashboardsService.constructor.getNewDashboard();
    }
  }

  save() {
    if (this.isDuplicate) {
      this.duplicateDashboard();
    }
    if (this.isEdit) {
      this.updateDashboard();
    }
    if (!this.isEdit && !this.isDuplicate) {
      this.createDashboard();
    }
  }

  /**
   * update dashboard
   *
   * @memberof LogsDashboardsCrudCtrl
   */
  updateDashboard() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }
    this.CucCloudMessage.flushChildMessage();
    this.saving = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsDashboardsService.updateDashboard(
          this.serviceName,
          this.dashboard.data,
        ).finally(() => {
          this.$uibModalInstance.close();
          this.CucControllerHelper.scrollPageToTop();
        }),
    });
    return this.saving.load();
  }

  /**
   * create new dashboard
   *
   * @memberof LogsDashboardsCrudCtrl
   */
  createDashboard() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }
    this.CucCloudMessage.flushChildMessage();
    this.saving = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsDashboardsService.createDashboard(
          this.serviceName,
          this.dashboard.data,
        ).finally(() => {
          this.$uibModalInstance.close();
          this.CucControllerHelper.scrollPageToTop();
        }),
    });
    return this.saving.load();
  }

  /**
   * create new dashboard from another dahsboard
   *
   * @memberof LogsDashboardsCrudCtrl
   */
  duplicateDashboard() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }
    this.CucCloudMessage.flushChildMessage();
    this.saving = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsDashboardsService.duplicateDashboard(
          this.serviceName,
          this.dashboard.data,
          this.$stateParams.dashboardId,
        ).finally(() => {
          this.$uibModalInstance.close();
          this.CucControllerHelper.scrollPageToTop();
        }),
    });
    return this.saving.load();
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}
