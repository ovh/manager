export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.assist.support',
    {
      url: '/support',
      views: {
        'faxView@telecom.telephony.billingAccount.fax.dashboard': {
          templateUrl:
            'app/telecom/telephony/service/assist/support/support.html',
          controller: 'TelecomTelephonyServiceAssistSupportCtrl',
          controllerAs: 'SupportCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_fax_assist_support_breadcrumb'),
      },
      translations: {
        value: ['../../../service/assist/support'],
        format: 'json',
      },
    },
  );
};
