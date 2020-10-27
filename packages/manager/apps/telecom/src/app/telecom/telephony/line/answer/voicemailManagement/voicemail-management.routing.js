import template from './voicemail-management.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.voicemailManagement',
    {
      url: '/voicemailManagement',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          template,
          noTranslations: true,
        },
        'voicemailView@telecom.telephony.billingAccount.line.voicemailManagement': {
          templateUrl:
            'app/telecom/telephony/service/voicemail/management/management.html',
          controller: 'TelecomTelephonyServiceVoicemailManagementCtrl',
          controllerAs: 'VoicemailManagementCtrl',
        },
      },
    },
  );
};
