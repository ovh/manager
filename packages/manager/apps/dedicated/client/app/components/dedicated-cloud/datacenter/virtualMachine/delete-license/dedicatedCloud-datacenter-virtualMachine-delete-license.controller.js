import {
  TRACKING_ACTION_POPUP_CONFIRM_PREFIX,
  TRACKING_DISPLAY_BANNER_INFO_PREFIX,
  TRACKING_DISPLAY_BANNER_ERROR_PREFIX,
  TRACKING_DISPLAY_PREFIX,
} from '../constants';

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
    const licenseTracked = (this.license || '').replace(/\s+/g, '-');

    this.trackClick(
      `${TRACKING_ACTION_POPUP_CONFIRM_PREFIX}delete_license::${this.guestOsFamily}_${licenseTracked}`,
      `${TRACKING_DISPLAY_PREFIX}popup::delete_license`,
    );
    this.loading = true;

    return this.ovhManagerDedicatedCloudDatacenterVirtualMachineService
      .deleteLicense(this.serviceName, this.datacenterId, this.vmId)
      .then(() => {
        this.trackPage(
          `${TRACKING_DISPLAY_BANNER_INFO_PREFIX}delete_license_${this.guestOsFamily}_${licenseTracked}_pending`,
        );
        this.goBack(this.$translate.instant('delete_license_success_api'));
      })
      .catch((err) => {
        this.trackPage(
          `${TRACKING_DISPLAY_BANNER_ERROR_PREFIX}delete_license_${this.guestOsFamily}_${licenseTracked}_error`,
        );

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
