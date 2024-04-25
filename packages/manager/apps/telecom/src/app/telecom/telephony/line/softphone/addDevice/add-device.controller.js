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

  generateLink() {
    return this.softphoneService
      .setDeviceName(
        this.$stateParams.billingAccount,
        this.$stateParams.serviceName,
        this.model.name,
        this.deviceId,
      )
      .then(({ deviceId }) => {
        this.deviceId = deviceId;
        return this.softphoneService.enroll(
          this.$stateParams.billingAccount,
          this.$stateParams.serviceName,
          this.deviceId,
        );
      })
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
}
