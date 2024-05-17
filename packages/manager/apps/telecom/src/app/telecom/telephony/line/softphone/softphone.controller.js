export default class {
  /* @ngInject */
  constructor(SoftphoneService, $stateParams, $translate, TucToast) {
    this.$stateParams = $stateParams;
    this.TucToast = TucToast;
    this.$translate = $translate;
    this.softphoneService = SoftphoneService;
  }

  $onInit() {
    this.regenerateTokenAvailable = this.currentServiceIsBeta;
  }

  handleToggleSwitch() {
    this.softphoneService
      .handleToggleBeta(
        this.$stateParams.billingAccount,
        this.$stateParams.serviceName,
        !this.currentServiceIsBeta,
      )
      .then(() => {
        this.regenerateTokenAvailable = this.currentServiceIsBeta;
        this.TucToast.success(
          this.$translate.instant(
            'telephony_line_tab_beta_softphone_option_message_success',
          ),
        );
      })
      .catch(() => {
        this.currentServiceIsBeta = !this.currentServiceIsBeta;
        this.TucToast.error(
          this.$translate.instant(
            'telephony_line_tab_beta_softphone_option_message_error',
          ),
        );
      });
  }

  regenerateLink() {
    this.regenerateTokenAvailable = false;
    this.softphoneService
      .regenerateToken(
        this.$stateParams.billingAccount,
        this.$stateParams.serviceName,
      )
      .then(() =>
        this.TucToast.success(
          this.$translate.instant(
            'telephony_line_tab_beta_softphone_email_message_success',
          ),
        ),
      )
      .catch(() =>
        this.TucToast.error(
          this.$translate.instant(
            'telephony_line_tab_beta_softphone_email_message_error',
          ),
        ),
      );
  }
}
