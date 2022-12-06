export default class SmsSmppParameterCtrl {
  /* @ngInject */
  constructor(SmsService) {
    this.smsService = SmsService;
  }

  $onInit() {
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
