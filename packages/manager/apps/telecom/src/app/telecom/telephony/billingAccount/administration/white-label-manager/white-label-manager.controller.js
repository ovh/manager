export default class TelecomTelephonyWhiteLabelManagerCtrl {
  /* @ngInject */
  constructor(
    $http,
    $translate,
    atInternet,
    TucToast,
    whiteLabelManagerService,
  ) {
    this.$http = $http;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.TucToast = TucToast;
    this.whiteLabelManagerService = whiteLabelManagerService;
  }

  $onInit() {
    this.agree = false;
  }

  onSubmit() {
    this.loading = true;

    this.atInternet.trackClick({
      name:
        'telecom::telephony::billingAccount::administration::whiteLabel::regenPassword',
      type: 'action',
    });

    return this.whiteLabelManagerService
      .resellerPanelResetPassword()
      .then(() =>
        this.TucToast.success(
          this.$translate.instant(
            'telephony_white_label_manager_reset_password_success',
          ),
        ),
      )
      .catch(() => {
        return this.TucToast.error(
          this.$translate.instant(
            'telephony_white_label_manager_reset_password_error',
          ),
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
