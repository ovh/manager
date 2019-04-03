export default class {
  /* @ngInject */
  constructor($stateParams, adpService, CucControllerHelper, CucServiceHelper) {
    this.adpService = adpService;
    this.cucControllerHelper = CucControllerHelper;
    this.cucServiceHelper = CucServiceHelper;
    this.serviceName = $stateParams.serviceName;
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
}
