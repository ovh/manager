angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.linesGroup', {
    url: '/linesGroup',
    views: {
      'groupView@telecom.telephony.billingAccount': {
        templateUrl:
          'app/telecom/telephony/account/billingAccount/administration/linesGroup/telecom-telephony-billing-account-administration-lines-group.html',
        controller: 'TelecomTelephonyBillingAccountAdministrationLinesGroup',
        controllerAs: 'LinesGroupCtrl',
      },
    },
    translations: { value: ['.', '..'], format: 'json' },
  });
});
