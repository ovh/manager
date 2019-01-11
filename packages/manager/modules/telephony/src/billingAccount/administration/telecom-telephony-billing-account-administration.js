angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.administration', {
    url: '/administration',
    views: {
      'groupInnerView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/billingAccount/administration/telecom-telephony-billing-account-administration.html',
        controller: 'TelecomTelephonyBillingAccountAdministrationCtrl',
        controllerAs: 'BillingAccountAdministrationCtrl',
      },
    },
    translations: ['.', '../billing'],
  });
});
