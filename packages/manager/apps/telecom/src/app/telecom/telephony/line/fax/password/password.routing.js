import template from './password.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.fax.password', {
    url: '/password',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        template,
        noTranslations: true,
      },
      'faxPasswordView@telecom.telephony.billingAccount.line.fax.password': {
        templateUrl: 'app/telecom/telephony/service/fax/password/password.html',
        controller: 'TelecomTelephonyServiceFaxPasswordCtrl',
        controllerAs: 'PasswordCtrl',
      },
    },
  });
};
