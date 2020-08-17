angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.administration.addGroup',
    {
      url: '/addGroup',
      views: {
        'groupView@telecom.telephony.billingAccount': {
          templateUrl:
            'app/telecom/telephony/billingAccount/administration/addGroup/telecom-telephony-billing-account-administration-add-group.html',
          controller: 'TelecomTelephonyBillingAccountAdministrationAddGroup',
          controllerAs: 'AddGroupCtrl',
        },
      },
      translations: { value: ['.', '..'], format: 'json' },
    },
  );
});
