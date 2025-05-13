export default class {
  /* @ngInject */
  constructor($translate, isSmppAccount, smsFeatureAvailability) {
    this.$translate = $translate;
    this.smsFeatureAvailability = smsFeatureAvailability;
    this.isSmppAccount = isSmppAccount;
  }

  $onInit() {
    const optionTrackingPrefix = 'sms::service::options::';
    this.actions = [
      ...(!this.isSmppAccount
        ? [
            {
              name: 'options_callback',
              sref: 'sms.service.options.callback',
              text: this.$translate.instant('sms_options_callback'),
              tracking: `${optionTrackingPrefix}callback-option`,
            },
          ]
        : []),
      ...(this.smsFeatureAvailability.isFeatureAvailable('sms:response')
        ? [
            {
              name: 'options_response',
              sref: 'sms.service.options.response',
              text: this.$translate.instant('sms_options_response'),
              tracking: `${optionTrackingPrefix}reply-option`,
            },
          ]
        : []),
      ...(!this.isSmppAccount
        ? [
            {
              name: 'options_recredit',
              sref: 'sms.service.options.recredit',
              text: this.$translate.instant('sms_options_recredit'),
              tracking: `${optionTrackingPrefix}recredit`,
            },
          ]
        : []),
      {
        name: 'options_blacklist',
        sref: 'sms.service.options.blacklist',
        text: this.$translate.instant('sms_options_blacklist'),
        tracking: `${optionTrackingPrefix}blacklist`,
      },
      ...(this.isSmppAccount
        ? [
            {
              name: 'option_smpp_parameter',
              sref: 'sms.service.options.smppParameter',
              text: this.$translate.instant('sms_options_smpp_parameter'),
              tracking: `${optionTrackingPrefix}configure-smpp`,
            },
          ]
        : []),
    ];
  }
}
