export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.actions = [
      {
        name: 'batch_compose',
        main: true,
        picto: 'ovh-font-sms',
        sref: 'sms.service.batches.create',
        text: this.$translate.instant('sms_batches_create'),
      },
      {
        name: 'statistics_history',
        main: true,
        picto: 'ovh-font-SMSEmitting',
        sref: 'sms.service.batches.history',
        text: this.$translate.instant('sms_batches_statistics_history'),
      },
      {
        name: 'sms_received',
        main: true,
        picto: 'ovh-font-SMSReceiving',
        sref: 'sms.service.sms.incoming',
        text: this.$translate.instant('sms_batches_sms_received'),
      },
      {
        name: 'batches_pending',
        main: true,
        picto: 'ovh-font-SMSPlanned',
        sref: 'sms.service.batches.pending',
        text: this.$translate.instant('sms_batches_pending'),
      },
      ...(this.smsFeatureAvailability.isFeatureAvailable('sms:hlr')
        ? [
            {
              name: 'sms_manage_hlrs',
              sref: 'sms.service.sms.hlr',
              text: this.$translate.instant('sms_batches_manage_hlrs'),
            },
          ]
        : []),
      {
        name: 'sms_manage_templates',
        sref: 'sms.service.sms.templates',
        text: this.$translate.instant('sms_batches_manage_templates'),
      },
    ];
  }
}
