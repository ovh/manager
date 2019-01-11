angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.deleteGroup', {
    url: '/deleteGroup',
    views: {
      'groupView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/billingAccount/administration/deleteGroup/telecom-telephony-billing-account-administration-delete-group.html',
        controller: 'TelecomTelephonyBillingAccountAdministrationDeleteGroup',
        controllerAs: 'DeleteGroupCtrl',
      },
    },
    translations: ['.', '..'],
  });
});
