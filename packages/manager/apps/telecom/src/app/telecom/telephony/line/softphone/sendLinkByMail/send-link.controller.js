export default class SendLinkController {
  /* @ngInject */
  constructor(
    $translate,
    $stateParams,
    softphoneService,
    TucToast,
    tucValidator,
  ) {
    this.$translate = $translate;
    this.TucToast = TucToast;
    this.$stateParams = $stateParams;
    this.softphoneService = softphoneService;
    this.validator = tucValidator;
    this.model = { email: null };
  }

  sendMail() {
    this.softphoneService
      .sendProvisioningToken(
        this.$stateParams.billingAccount,
        this.$stateParams.serviceName,
        this.$stateParams.deviceId,
        this.model.email,
      )
      .then(() =>
        this.goToSoftphoneDashboard(this.$stateParams).then(() =>
          this.TucToast.success(
            this.$translate.instant(
              'telephony_line_softphone_send_link_success',
            ),
          ),
        ),
      )
      .catch(({ data: { message } }) =>
        this.goToSoftphoneDashboard(this.$stateParams).then(() =>
          this.TucToast.error(
            this.$translate.instant(
              'telephony_line_softphone_send_link_error',
              {
                message,
              },
            ),
          ),
        ),
      );
  }
}
