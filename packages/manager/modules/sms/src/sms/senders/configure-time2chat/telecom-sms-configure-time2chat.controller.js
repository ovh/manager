import { PHONE_NUMBER_FOR_TIME2CHAT_REGEX } from '../../telecom-sms.constant';

export default class SmsSendersConfigureTime2ChatCtrl {
  /* @ngInject */
  constructor($q, $stateParams, $translate, SmsService, TucToast) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.smsService = SmsService;
    this.TucToast = TucToast;
    this.PHONE_NUMBER_FOR_TIME2CHAT_REGEX = PHONE_NUMBER_FOR_TIME2CHAT_REGEX;
  }

  $onInit() {
    this.isLoading = true;
    this.$q
      .all({
        contactInfo: this.smsService.getContactInfo(
          this.$stateParams.serviceName,
          this.$stateParams.number,
        ),
        autoResponse: this.smsService.getAutoResponseMessage(
          this.$stateParams.serviceName,
          this.$stateParams.number,
        ),
        kycData: this.smsService.getKyc(
          this.$stateParams.serviceName,
          this.$stateParams.number,
        ),
      })
      .then(({ contactInfo, autoResponse, kycData }) => {
        this.contactInfoData = contactInfo;
        this.kycData = kycData;
        this.autoResponseData = autoResponse;
      })
      .catch((err) => {
        this.TucToast.error(
          this.$translate.instant('sms_senders_configure_loading_error', {
            error: err?.data?.message,
          }),
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  /**
   * Update contact info.
   * @return {Promise}
   */
  updateContactInfo() {
    return this.smsService
      .updateContactInfo(
        this.$stateParams.serviceName,
        this.$stateParams.number,
        this.contactInfoData,
      )
      .then(() => {
        this.TucToast.success(
          this.$translate.instant(
            'sms_senders_configure_contact_info_update_success',
          ),
        );
      })
      .catch((err) => {
        this.TucToast.error(
          this.$translate.instant(
            'sms_senders_configure_contact_info_update_error',
            { error: err?.data?.message },
          ),
        );
      });
  }

  /**
   * Update auto response message.
   * @return {Promise}
   */
  updateAutoResponseMessage() {
    return this.smsService
      .updateAutoResponseMessage(
        this.$stateParams.serviceName,
        this.$stateParams.number,
        this.autoResponseData,
      )
      .then(() => {
        this.TucToast.success(
          this.$translate.instant(
            'sms_senders_configure_auto_response_update_success',
          ),
        );
      })
      .catch((err) => {
        this.TucToast.error(
          this.$translate.instant(
            'sms_senders_configure_auto_response_update_error',
            { error: err?.data?.message },
          ),
        );
      });
  }

  /**
   * Update kyc info.
   * @return {Promise}
   */
  updateKyc() {
    return this.smsService
      .updateKyc(
        this.$stateParams.serviceName,
        this.$stateParams.number,
        this.kycData,
      )
      .then(() => {
        this.TucToast.success(
          this.$translate.instant('sms_senders_configure_kyc_update_success'),
        );
      })
      .catch((err) => {
        this.TucToast.error(
          this.$translate.instant('sms_senders_configure_kyc_update_error', {
            error: err?.data?.message,
          }),
        );
      });
  }
}
