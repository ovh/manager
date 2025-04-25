export default class DedicatedCloudDatacenterNetworkDeleteNsxCtrl {
  /* @ngInject */
  constructor($translate, $q, DedicatedCloud, ovhManagerPccDatacenterService) {
    this.$translate = $translate;
    this.$q = $q;
    this.DedicatedCloud = DedicatedCloud;
    this.ovhManagerPccDatacenterService = ovhManagerPccDatacenterService;
  }

  $onInit() {
    this.checkPossibilityToDelete();
  }

  onConfirm() {
    this.isLoading = true;

    this.removeNsxtEdge()
      .then(() => {
        this.handleSuccess(
          `${this.$translate.instant(
            'dedicatedcloud_datacenter_network_delete_nsx_success',
          )}`,
        );
      })
      .catch((error) => {
        this.handleError(
          this.$translate.instant(
            'dedicatedcloud_datacenter_network_delete_nsx_error',
            { error: error.data.message },
          ),
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  checkResilienceModeError() {
    return this.ovhManagerPccDatacenterService
      .isResilienceModeEnabled({
        serviceName: this.serviceName,
        datacenterId: this.datacenterId,
        nsxtEdgeId: this.nsxtEdgeId,
      })
      .then((data) => {
        this.hasResilienceModeError = !data;
      });
  }

  checkPendingDeleteTaskError() {
    return this.DedicatedCloud.getDatacenterPendingRemoveNsxTask(
      this.serviceName,
      this.datacenterId,
    ).then((data) => {
      this.hasPendingDeleteTaskError = data.length > 0;
    });
  }

  checkPossibilityToDelete() {
    this.isLoading = true;

    this.$q
      .all([
        this.checkResilienceModeError(),
        this.checkPendingDeleteTaskError(),
      ])
      .finally(() => {
        this.isLoading = false;
      });
  }
}
