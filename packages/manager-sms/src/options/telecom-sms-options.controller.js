export default class TelecomSmsOptionsCtrl {
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.actions = [{
      name: 'options_manage',
      sref: 'sms.options.manage',
      text: this.$translate.instant('sms_options_manage'),
    }, {
      name: 'options_response',
      sref: 'sms.options.response',
      text: this.$translate.instant('sms_options_response'),
    }, {
      name: 'options_recredit',
      sref: 'sms.options.recredit',
      text: this.$translate.instant('sms_options_recredit'),
    }];
  }
}
