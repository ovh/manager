angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.manageContacts', {
    url: '/manageContacts',
    views: {
      'groupInnerView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/billingAccount/manageContacts/telecom-telephony-billing-account-manageContacts.html',
        controller: 'TelecomTelephonyBillingAccountManageContactsCtrl',
        controllerAs: 'ManageContactsCtrl',
      },
    },
    translations: ['.'],
  });
});
