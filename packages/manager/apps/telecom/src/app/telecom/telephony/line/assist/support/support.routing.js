export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.assist.support', {
    url: '/support',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        templateUrl:
          'app/telecom/telephony/service/assist/support/support.html',
        controller: 'TelecomTelephonyServiceAssistSupportCtrl',
        controllerAs: 'SupportCtrl',
      },
    },
  });
};
