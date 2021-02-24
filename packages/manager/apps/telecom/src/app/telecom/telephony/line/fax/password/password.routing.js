import template from './password.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.fax.password',
    {
      url: '/password',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          noTranslations: true,
        },
        'faxPasswordView@telecom.telephony.billingAccount.line.dashboard.fax.password': {
          templateUrl:
            'app/telecom/telephony/service/fax/password/password.html',
          controller: 'TelecomTelephonyServiceFaxPasswordCtrl',
          controllerAs: 'PasswordCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_line_fax_password_breadcrumb'),
      },
    },
  );
};
