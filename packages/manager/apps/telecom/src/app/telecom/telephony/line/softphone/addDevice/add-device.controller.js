import { FIELD_NAME_REGEX } from './add-device.constants';

export default class SoftphoneAddDeviceController {
  constructor(softphoneService, TucToast, $translate, $stateParams) {
    this.softphoneService = softphoneService;
    this.TucToast = TucToast;
    this.$translate = $translate;
    this.$stateParams = $stateParams;
    this.model = { name: null };
    this.FIELD_NAME_REGEX = FIELD_NAME_REGEX;
  }

  generateLink() {
    this.softphoneService
      .generateLink(
        this.$stateParams.billingAccount,
        this.$stateParams.serviceName,
        this.model.name,
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
}
