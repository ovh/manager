export default class {
  /* @ngInject */
  constructor($state, $stateParams, adpService, CucControllerHelper,
    CucServiceHelper, ADP_CLUSTER_MANAGE, ADP_SERVICES, ADP_STATUS_MAP) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.adpService = adpService;
    this.cucControllerHelper = CucControllerHelper;
    this.cucServiceHelper = CucServiceHelper;
    this.serviceName = this.$stateParams.serviceName;
    this.ADP_SERVICES = ADP_SERVICES;
    this.ADP_CLUSTER_MANAGE = ADP_CLUSTER_MANAGE;
    this.ADP_STATUS_MAP = ADP_STATUS_MAP;
  }

  $onInit() {
    this.fetchAdpDetails()
      .then(() => {
        this.fetchPublicCloudDetails();
        this.fetchVRack(this.platformDetails.data.vrack_id);
      });
  }

  /**
   * fetch all active public clouds
   *
   * @returns array of public cloud objects
   */
  fetchPublicCloudDetails() {
    this.publicCloudDetails = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.adpService.getPubliCloudDetails(
        this.platformDetails.data.project_id,
      )
        .catch(error => this.cucServiceHelper.errorHandler('adp_get_cluster_info_error')(error)),
    });
    return this.publicCloudDetails.load();
  }

  /**
   * fetch details of platform
   *
   * @returns object which contains details of platform
   */
  fetchAdpDetails() {
    this.platformDetails = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.adpService.getAdpDetails(
        this.serviceName,
      )
        .catch(error => this.cucServiceHelper.errorHandler('adp_get_cluster_info_error')(error)),
    });
    return this.platformDetails.load();
  }

  /**
   * fetch vRack details
   *
   * @param {*} serviceName vRack service name
   * @returns the vRack object
   */
  fetchVRack(serviceName) {
    this.vRack = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.adpService.getVRack(serviceName),
    });
    return this.vRack.load();
  }

  /**
   * get adp service urls
   *
   * @param {*} adpServiceName adp service name like AMBARI
   * @param {*} adpClusterServiceName adp cluster service name
   * @returns constructed url to manage adp cluster services
   * @memberof ADPService
   */
  getAdpServiceUrl(adpServiceName, adpClusterServiceName) {
    return this.ADP_CLUSTER_MANAGE[adpServiceName].replace('serviceName', adpClusterServiceName);
  }

  goToBillingConsole() {
    this.$state.go('iaas.pci-project.billing.consumption.current', {
      projectId: this.publicCloudDetails.data.project_id,
    });
  }
}
