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
    this.errorLoading = null;
    this.selectedLicense = null;
  }

  $onInit() {
    this.loading = true;
    return this.DedicatedCloud.getModels()
      .then((data) => {
        this.licenseEnums =
          data.models['dedicatedCloud.spla.KmsLicenseEnum'].enum;
        // we have to filter enums compatible to os famillies
      })
      .catch((err) => {
        this.errorLoading = null;
        this.errorLoading = `${this.$translate.instant('')} ${err.message ||
          err}`;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  setLicense() {
    this.loading = true;

    return this.ovhManagerDedicatedCloudDatacenterVirtualMachineService
      .setLicense(
        this.serviceName,
        this.datacenterId,
        this.vmId,
        this.selectedLicense,
      )
      .then(() => {
        this.goBack(this.$translate.instant('set_license_success_api'));
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant('set_license_error_api')}: ${err.data
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
