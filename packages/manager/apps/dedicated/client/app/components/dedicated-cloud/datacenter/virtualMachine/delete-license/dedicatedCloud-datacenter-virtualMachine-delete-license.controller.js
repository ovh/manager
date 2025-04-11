export default class {
  /* @ngInject */
  constructor(
    $translate,
    ovhManagerDedicatedCloudDatacenterVirtualMachineService,
    DedicatedCloud,
  ) {
    this.$translate = $translate;
    this.ovhManagerDedicatedCloudDatacenterVirtualMachineService = ovhManagerDedicatedCloudDatacenterVirtualMachineService;
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.loading = false;
  }

  deleteLicense() {
    this.loading = true;

    return this.ovhManagerDedicatedCloudDatacenterVirtualMachineService
      .deleteLicense(this.serviceName, this.datacenterId, this.vmId)
      .then(() => {
        this.goBack(this.$translate.instant('delete_license_success_api'));
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant('delete_license_error_api')}: ${err.data
            ?.message ||
            err.message ||
            JSON.stringify(err)}`,
          'danger',
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  onCancel() {
    return this.goBack();
  }
}
