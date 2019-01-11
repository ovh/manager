angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.addGroup', {
    url: '/addGroup',
    views: {
      'groupView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/billingAccount/administration/addGroup/telecom-telephony-billing-account-administration-add-group.html',
        controller: 'TelecomTelephonyBillingAccountAdministrationAddGroup',
        controllerAs: 'AddGroupCtrl',
      },
    },
    translations: ['.', '..'],
  });
});
