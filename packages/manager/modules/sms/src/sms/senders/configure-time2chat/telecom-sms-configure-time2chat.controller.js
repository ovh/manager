export default class {
  /* @ngInject */
  constructor(
    $http,
    $q,
    $stateParams,
    $translate,
    $state,
    SmsService,
    TucToast,
    TucToastError,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$state = $state;
    this.smsService = SmsService;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.contatInfo = {};
    this.kycData = {};
    this.autoMessage = '';
  }

  /**
   * Update contact info.
   * @return {Promise}
   */
  updateContatInfo() {
    return this.smsService
      .updateContatInfo(
        this.$stateParams.serviceName,
        this.$stateParams.number,
        {
          name: this.contatInfo.name,
          email: this.contatInfo.email,
          phonenumber: this.contatInfo.phonenumber,
        },
      )
      .then(() => {
        this.TucToast.success(
          this.$translate.instant(
            'sms_senders_configure_contact_info_update_success',
          ),
        );
      })
      .catch(() => {
        this.TucToast.error(
          this.$translate.instant(
            'sms_senders_configure_contact_info_update_error',
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
        {
          auto_response: this.autoMessage,
        },
      )
      .then(() => {
        this.TucToast.success(
          this.$translate.instant(
            'sms_senders_configure_auto_response_update_success',
          ),
        );
      })
      .catch(() => {
        this.TucToast.error(
          this.$translate.instant(
            'sms_senders_configure_auto_response_update_error',
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
      .updateKyc(this.$stateParams.serviceName, this.$stateParams.number, {
        company_name: this.kycData.company_name,
        brand_name: this.kycData.brand_name,
        primary_use_case: this.kycData.primary_use_case,
        contact_email: this.kycData.contact_email,
      })
      .then(() => {
        this.TucToast.success(
          this.$translate.instant('sms_senders_configure_kyc_update_success'),
        );
      })
      .catch(() => {
        this.TucToast.error(
          this.$translate.instant('sms_senders_configure_kyc_update_error'),
        );
      });
  }
}
