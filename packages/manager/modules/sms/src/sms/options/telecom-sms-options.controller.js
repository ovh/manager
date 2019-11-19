export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.actions = [{
      name: 'options_manage',
      sref: 'sms.service.options.manage',
      text: this.$translate.instant('sms_options_manage'),
    }, {
      name: 'options_response',
      sref: 'sms.service.options.response',
      text: this.$translate.instant('sms_options_response'),
    }, {
      name: 'options_recredit',
      sref: 'sms.service.options.recredit',
      text: this.$translate.instant('sms_options_recredit'),
    }, {
      name: 'options_blacklist',
      sref: 'sms.service.options.blacklist',
      text: this.$translate.instant('sms_options_blacklist'),
    }];
  }
}
