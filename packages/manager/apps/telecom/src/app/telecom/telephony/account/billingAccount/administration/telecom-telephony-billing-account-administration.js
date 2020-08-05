angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.administration', {
    url: '/administration',
    views: {
      'groupInnerView@telecom.telephony.billingAccount': {
        templateUrl:
          'app/telecom/telephony/account/billingAccount/administration/telecom-telephony-billing-account-administration.html',
        controller: 'TelecomTelephonyBillingAccountAdministrationCtrl',
        controllerAs: 'BillingAccountAdministrationCtrl',
      },
    },
    translations: { value: ['.', '../billing'], format: 'json' },
  });
});
