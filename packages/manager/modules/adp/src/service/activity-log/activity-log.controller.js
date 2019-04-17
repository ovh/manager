export default class {
  /* @ngInject */
  constructor($stateParams, adpService, CucControllerHelper, CucServiceHelper, ADP_STATUS_MAP) {
    this.adpService = adpService;
    this.cucControllerHelper = CucControllerHelper;
    this.cucServiceHelper = CucServiceHelper;
    this.serviceName = $stateParams.serviceName;
    this.ADP_STATUS_MAP = ADP_STATUS_MAP;
  }

  $onInit() {
    this.getActivities();
  }

  getActivities() {
    this.activities = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.adpService.getAdpActivityLogs(this.serviceName)
        .catch(error => this.cucServiceHelper.errorHandler('adp_get_activities_error')(error)),
    });
    return this.activities.load();
  }

  refresh() {
    return this.getActivities();
  }
}
