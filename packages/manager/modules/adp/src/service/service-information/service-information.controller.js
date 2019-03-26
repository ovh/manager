export default class {
  /* @ngInject */
  constructor($stateParams, adpService, CucControllerHelper,
    CucServiceHelper) {
    this.adpService = adpService;
    this.cucControllerHelper = CucControllerHelper;
    this.cucServiceHelper = CucServiceHelper;
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.platformDetails = this.adpService.platformDetail;
    this.details = null;
    this.clusterManage = {
      AMBARI: 'AMBARI',
      FREEIPA: 'FREEIPA',
      RANGER: 'RANGER',
    };
  }

  $onInit() {
    this.fetchAdpDetails()
      .then(() => this.fetchServiceInfo());
  }

  fetchServiceInfo() {
    this.serviceInfoDetails = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.adpService.getCloudProjectServiceInformation(
        this.platformDetails.data.project_id,
      )
        .catch(error => this.cucServiceHelper.errorHandler('adp_get_cluster_info_error')(error)),
    });
    return this.serviceInfoDetails.load();
  }

  fetchAdpDetails() {
    this.platformDetails = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.adpService.getAdpDetails(
        this.serviceName,
      )
        .catch(error => this.cucServiceHelper.errorHandler('adp_get_cluster_info_error')(error)),
    });
    return this.platformDetails.load();
  }

  getVrackUrl() {
    return `/vrack/${this.platformDetails.data.vrack_id}`;
  }

  getCloudProjectUrl() {
    return `/iaas/pci/project/${this.platformDetails.data.project_id}/compute/infrastructure/diagram`;
  }
}
