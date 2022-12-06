export default class {
  /* @ngInject */
  constructor($translate, isSmppAccount, smsFeatureAvailability) {
    this.$translate = $translate;
    this.smsFeatureAvailability = smsFeatureAvailability;
    this.isSmppAccount = isSmppAccount;
  }

  $onInit() {
    this.actions = [
      {
        name: 'options_manage',
        sref: 'sms.service.options.manage',
        text: this.$translate.instant('sms_options_manage'),
      },
      ...(this.smsFeatureAvailability.isFeatureAvailable('sms:response')
        ? [
            {
              name: 'options_response',
              sref: 'sms.service.options.response',
              text: this.$translate.instant('sms_options_response'),
            },
          ]
        : []),
      {
        name: 'options_recredit',
        sref: 'sms.service.options.recredit',
        text: this.$translate.instant('sms_options_recredit'),
      },
      {
        name: 'options_blacklist',
        sref: 'sms.service.options.blacklist',
        text: this.$translate.instant('sms_options_blacklist'),
      },
      ...(this.isSmppAccount
        ? [
            {
              name: 'option_smpp_parameter',
              sref: 'sms.service.options.smppParameter',
              text: this.$translate.instant('sms_options_smpp_parameter'),
            },
          ]
        : []),
    ];
  }
}
