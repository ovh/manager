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

  enrollDevice(deviceId) {
    return this.softphoneService
      .enroll(
        this.$stateParams.billingAccount,
        this.$stateParams.serviceName,
        deviceId,
      )
      .then(({ provisioningURL }) => {
        this.recordLink = provisioningURL;
      })
      .catch(() => {
        this.TucToast.error(
          this.$translate.instant(
            'telephony_line_softphone_generate_link_error',
          ),
        );
      });
  }

  generateLink() {
    if (this.deviceId && this.softphoneAddDeviceForm.$pristine) {
      return this.softphoneService
        .enroll(
          this.$stateParams.billingAccount,
          this.$stateParams.serviceName,
          this.deviceId,
        )
        .catch(() => {
          this.TucToast.error(
            this.$translate.instant(
              'telephony_line_softphone_generate_link_error',
            ),
          );
        })
        .finally(() => this.softphoneAddDeviceForm.$setPristine(true));
    }

    if (!this.deviceId) {
      return this.softphoneService
        .createDevice(
          this.$stateParams.billingAccount,
          this.$stateParams.serviceName,
          this.model.name,
        )
        .then(({ deviceId }) => {
          this.deviceId = deviceId;
          return this.enrollDevice(this.deviceId);
        })
        .catch(() => {
          this.TucToast.error(
            this.$translate.instant(
              'telephony_line_softphone_generate_link_error',
            ),
          );
        })
        .finally(() => this.softphoneAddDeviceForm.$setPristine(true));
    }

    return this.softphoneService
      .setDeviceName(
        this.$stateParams.billingAccount,
        this.$stateParams.serviceName,
        this.model.name,
        this.deviceId,
      )
      .then(() => {
        return this.enrollDevice(this.deviceId);
      })
      .catch(() => {
        this.TucToast.error(
          this.$translate.instant(
            'telephony_line_softphone_generate_link_error',
          ),
        );
      })
      .finally(() => this.softphoneAddDeviceForm.$setPristine(true));
  }
}
