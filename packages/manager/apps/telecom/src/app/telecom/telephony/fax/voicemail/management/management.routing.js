import template from './management.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.voicemail.management',
    {
      url: '/management',
      views: {
        'faxView@telecom.telephony.billingAccount.fax': {
          template,
          noTranslations: true,
        },
        'voicemailView@telecom.telephony.billingAccount.fax.voicemail.management': {
          templateUrl:
            'app/telecom/telephony/service/voicemail/management/management.html',
          controller: 'TelecomTelephonyServiceVoicemailManagementCtrl',
          controllerAs: 'VoicemailManagementCtrl',
        },
      },
    },
  );
};
