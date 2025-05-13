import template from './password.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.fax.password',
    {
      url: '/password',
      views: {
        'telephonyView@telecom.telephony': {
          template,
          noTranslations: true,
        },
        'faxPasswordView@telecom.telephony.billingAccount.fax.dashboard.fax.password': {
          templateUrl:
            'app/telecom/telephony/service/fax/password/password.html',
          controller: 'TelecomTelephonyServiceFaxPasswordCtrl',
          controllerAs: 'PasswordCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_fax_fax_password'),
      },
    },
  );
};
