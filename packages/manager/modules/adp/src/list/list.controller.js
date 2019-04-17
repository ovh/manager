export default class {
  /* @ngInject */
  constructor($state, $stateParams, adpService, CucControllerHelper, CucServiceHelper,
    ADP_STATUS, ADP_STATUS_MAP) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.adpService = adpService;
    this.cucControllerHelper = CucControllerHelper;
    this.cucServiceHelper = CucServiceHelper;

    this.ADP_STATUS = ADP_STATUS;
    this.ADP_STATUS_MAP = ADP_STATUS_MAP;
  }

  $onInit() {
    this.getClusters();
  }

  /**
   * fetch all cluster nodes along with their details
   *
   * @returns array of cluster nodes along with their details
   */
  getClusters() {
    this.clusters = this.cucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.adpService.getAdpWithDetails()
        .catch(error => this.cucServiceHelper.errorHandler('adp_get_cluster_error')(error)),
    });
    return this.clusters.load();
  }

  refresh() {
    return this.getClusters();
  }

  goToDeployAdpPage() {
    this.$state.go('adp.deploy');
  }

  goToManageAdpCluster(serviceName) {
    this.$state.go('adp.service.details', { serviceName });
  }
}
