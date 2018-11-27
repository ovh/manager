angular.module('managerApp').controller('TelecomSmsOptionsCtrl', class TelecomSmsOptionsCtrl {
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.actions = [{
      name: 'options_manage',
      sref: 'telecom.sms.options.manage',
      text: this.$translate.instant('sms_options_manage'),
    }, {
      name: 'options_response',
      sref: 'telecom.sms.options.response',
      text: this.$translate.instant('sms_options_response'),
    }, {
      name: 'options_recredit',
      sref: 'telecom.sms.options.recredit',
      text: this.$translate.instant('sms_options_recredit'),
    }];
  }
});
