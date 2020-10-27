import template from './password.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.fax.fax.password', {
    url: '/password',
    views: {
      'telephonyView@telecom.telephony': {
        template,
        noTranslations: true,
      },
      'faxPasswordView@telecom.telephony.billingAccount.fax.fax.password': {
        templateUrl: 'app/telecom/telephony/service/fax/password/password.html',
        controller: 'TelecomTelephonyServiceFaxPasswordCtrl',
        controllerAs: 'PasswordCtrl',
      },
    },
  });
};
