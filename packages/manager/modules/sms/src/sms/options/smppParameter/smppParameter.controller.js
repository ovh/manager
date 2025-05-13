export default class SmsSmppParameterCtrl {
  /* @ngInject */
  constructor(SmsService, $timeout, $state) {
    this.smsService = SmsService;
    this.$timeout = $timeout;
    this.$state = $state;
  }

  $onInit() {
    this.timer = null;
    this.OPTION_SMPP_TRACKING_PREFIX = 'sms::service::configure-smpp::';
    this.loading = true;
    return this.smsService
      .getSmppSettings(this.serviceName)
      .then((result) => {
        this.smppSettings = result;
        if (this.smppSettings.status === 'UPDATING_IP') {
          this.checkStatus();
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }

  $onDestroy() {
    this.$timeout.cancel(this.timer);
  }

  checkStatus() {
    return this.smsService
      .getSmppSettings(this.serviceName)
      .then(({ status }) => {
        this.smppSettings.status = status;
        if (
          status === 'UPDATING_IP' &&
          this.$state.current.name === 'sms.service.options.smppParameter'
        ) {
          this.timer = this.$timeout(() => this.checkStatus(), 5000);
          return null;
        }
        return status;
      });
  }
}
