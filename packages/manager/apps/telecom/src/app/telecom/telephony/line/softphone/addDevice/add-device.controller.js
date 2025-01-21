export default class SoftphoneAddDeviceController {
  /* @ngInject */
  constructor(softphoneService, TucToast, $translate) {
    this.softphoneService = softphoneService;
    this.TucToast = TucToast;
    this.$translate = $translate;
  }

  createToken() {
    this.isCreating = true;
    this.softphoneService
      .createToken(this.billingAccount, this.serviceName, this.email)
      .then(({ token }) => {
        this.token = token;
      })
      .catch(({ data }) => {
        this.TucToast.error(
          this.$translate.instant(
            'telephony_line_softphone_generate_token_error',
            { error: data?.message },
          ),
        );
      })
      .finally(() => {
        this.isCreating = false;
      });
  }
}
