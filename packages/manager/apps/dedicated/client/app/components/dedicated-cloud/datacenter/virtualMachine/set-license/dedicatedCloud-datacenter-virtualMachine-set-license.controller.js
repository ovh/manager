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
    const selectedLicenseTrack = (this.selectedLicense || '').replace(
      /\s+/g,
      '-',
    );
    this.trackClick(
      `${TRACKING_ACTION_POPUP_CONFIRM_PREFIX}activate_license::${this.guestOsFamily}_${selectedLicenseTrack}`,
      `${TRACKING_DISPLAY_PREFIX}popup::activate_license`,
    );
    this.loading = true;

    return this.ovhManagerDedicatedCloudDatacenterVirtualMachineService
      .setLicense(
        this.serviceName,
        this.datacenterId,
        this.vmId,
        this.selectedLicense,
      )
      .then(() => {
        this.trackPage(
          `${TRACKING_DISPLAY_BANNER_INFO_PREFIX}activate_license_${this.guestOsFamily}_${selectedLicenseTrack}_pending`,
        );

        this.goBack(this.$translate.instant('set_license_success_api'));
      })
      .catch((err) => {
        this.trackPage(
          `${TRACKING_DISPLAY_BANNER_ERROR_PREFIX}delete_license_${this.guestOsFamily}_${selectedLicenseTrack}_error`,
        );
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
