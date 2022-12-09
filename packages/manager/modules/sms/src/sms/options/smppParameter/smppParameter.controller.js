export default class SmsSmppParameterCtrl {
  /* @ngInject */
  constructor(SmsService) {
    this.smsService = SmsService;
  }

  $onInit() {
    this.OPTION_SMPP_TRACKING_PREFIX = 'sms::service::configure-smpp::';
    this.loading = true;
    return this.smsService
      .getSmppSettings(this.serviceName)
      .then((result) => {
        this.smppSettings = result;
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
