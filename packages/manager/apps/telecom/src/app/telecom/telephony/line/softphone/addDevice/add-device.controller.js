import { FIELD_NAME_REGEX } from './add-device.constants';

export default class SoftphoneAddDeviceController {
  /* @ngInject */
  constructor(softphoneService, TucToast, $translate, $stateParams) {
    this.softphoneService = softphoneService;
    this.TucToast = TucToast;
    this.$translate = $translate;
    this.$stateParams = $stateParams;
    this.model = { name: null };
    this.FIELD_NAME_REGEX = FIELD_NAME_REGEX;
  }

  createDevice() {
    return this.softphoneService
      .createDevice(
        this.$stateParams.billingAccount,
        this.$stateParams.serviceName,
        this.model.name,
      )
      .then(({ deviceId }) => {
        this.deviceId = deviceId;
      });
  }

  modifyDevice() {
    return this.softphoneService.modifyDevice(
      this.$stateParams.billingAccount,
      this.$stateParams.serviceName,
      this.model.name,
      this.deviceId,
    );
  }

  enrollDevice() {
    return this.softphoneService
      .enroll(
        this.$stateParams.billingAccount,
        this.$stateParams.serviceName,
        this.deviceId,
      )
      .then(({ provisioningURL }) => {
        this.recordLink = provisioningURL;
      });
  }

  generateLink() {
    let promise;
    if (!this.softphoneAddDeviceForm.input_name.$pristine) {
      this.softphoneAddDeviceForm.input_name.$setPristine(true);
      promise = Promise.resolve(
        !this.deviceId ? this.createDevice() : this.modifyDevice(),
      ).then(() => this.enrollDevice());
    } else {
      promise = this.enrollDevice();
    }

    promise.catch(() => {
      this.TucToast.error(
        this.$translate.instant('telephony_line_softphone_generate_link_error'),
      );
    });
  }
}
