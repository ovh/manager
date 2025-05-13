import template from './management.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.voicemail.management',
    {
      url: '/management',
      views: {
        'faxView@telecom.telephony.billingAccount.fax.dashboard': {
          template,
          noTranslations: true,
        },
        'voicemailView@telecom.telephony.billingAccount.fax.dashboard.voicemail.management': {
          templateUrl:
            'app/telecom/telephony/service/voicemail/management/management.html',
          controller: 'TelecomTelephonyServiceVoicemailManagementCtrl',
          controllerAs: 'VoicemailManagementCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_fax_voicemail_management'),
      },
    },
  );
};
