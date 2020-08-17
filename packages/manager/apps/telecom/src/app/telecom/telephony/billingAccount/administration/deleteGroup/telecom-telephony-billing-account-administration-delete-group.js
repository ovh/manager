angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.administration.deleteGroup',
    {
      url: '/deleteGroup',
      views: {
        'groupView@telecom.telephony.billingAccount': {
          templateUrl:
            'app/telecom/telephony/billingAccount/administration/deleteGroup/telecom-telephony-billing-account-administration-delete-group.html',
          controller: 'TelecomTelephonyBillingAccountAdministrationDeleteGroup',
          controllerAs: 'DeleteGroupCtrl',
        },
      },
      translations: { value: ['.', '..'], format: 'json' },
    },
  );
});
