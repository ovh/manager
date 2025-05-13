import { SMPP_STATUS, SMPP_BADAGES_STATUS } from './service-status.constant';

export default class SmsServiceStatusController {
  /* @ngInject */
  constructor($translate, atInternet, SmsService, coreConfig, TucToast) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.smsService = SmsService;
    this.tucToast = TucToast;
    this.emailAccount = coreConfig.getUser().email;
    this.isOpenModal = false;
    this.isSubmitting = false;
    this.SMPP_STATUS = SMPP_STATUS;
    this.SMPP_BADAGES_STATUS = SMPP_BADAGES_STATUS;
  }

  onResetPasswordBtnClick(state) {
    this.isOpenModal = state;
    if (state) {
      this.trackClick('new-password');
      this.atInternet.trackPage({
        name: `${this.trackingPrefix}newPassword`,
      });
    } else {
      this.trackClick('newPassword::cancel');
    }
  }

  submitResetPassword() {
    this.isSubmitting = true;
    this.trackClick('newPassword::confirm');
    return this.smsService
      .postResetSmppPassword(this.serviceName)
      .then(() =>
        this.tucToast.success(
          this.$translate.instant(
            'sms_component_serviceStatus_password_message_success',
            { email: `<strong>${this.emailAccount}</strong>` },
          ),
        ),
      )
      .catch(() =>
        this.tucToast.error(
          this.$translate.instant(
            'sms_component_serviceStatus_password_message_error',
          ),
        ),
      )
      .finally(() => {
        this.isOpenModal = false;
        this.isSubmitting = false;
      });
  }

  trackClick(hit) {
    return this.atInternet.trackClick({
      name: `${this.trackingPrefix}${hit}`,
      type: 'action',
    });
  }
}
