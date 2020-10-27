import template from './options.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.voicemail.options',
    {
      url: '/options',
      views: {
        'faxView@telecom.telephony.billingAccount.fax': {
          template,
          noTranslations: true,
        },
        'voicemailView@telecom.telephony.billingAccount.fax.voicemail.options': {
          templateUrl:
            'app/telecom/telephony/service/voicemail/options/options.html',
          controller: 'TelecomTelephonyServiceVoicemailOptionsCtrl',
          controllerAs: 'VoicemailOptionsCtrl',
        },
      },
    },
  );
};
