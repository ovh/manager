export default class {
  /* @ngInject */
  constructor($translate, smsFeatureAvailability) {
    this.$translate = $translate;
    this.smsFeatureAvailability = smsFeatureAvailability;
  }

  $onInit() {
    this.actions = [
      {
        name: 'sms_compose',
        main: true,
        picto: 'ovh-font-sms',
        sref: 'sms.service.sms.compose',
        text: this.$translate.instant('sms_sms_compose'),
      },
      {
        name: 'sms_history',
        main: true,
        picto: 'ovh-font-SMSEmitting',
        sref: 'sms.service.sms.outgoing',
        text: this.$translate.instant('sms_sms_history'),
      },
      {
        name: 'sms_received',
        main: true,
        picto: 'ovh-font-SMSReceiving',
        sref: 'sms.service.sms.incoming',
        text: this.$translate.instant('sms_sms_received'),
      },
      {
        name: 'sms_pending',
        main: true,
        picto: 'ovh-font-SMSPlanned',
        sref: 'sms.service.sms.pending',
        text: this.$translate.instant('sms_sms_pending'),
      },
      ...(this.smsFeatureAvailability.isFeatureAvailable('sms:hlr')
        ? [
            {
              name: 'sms_manage_hlrs',
              sref: 'sms.service.sms.hlr',
              text: this.$translate.instant('sms_sms_manage_hlrs'),
            },
          ]
        : []),
      {
        name: 'sms_manage_templates',
        sref: 'sms.service.sms.templates',
        text: this.$translate.instant('sms_sms_manage_templates'),
      },
    ];
  }
}
