angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.addGroup', {
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
    redirectTo: (transition) =>
      transition
        .injector()
        .get('TelephonyMediator')
        .getGroup(transition.params().billingAccount)
        .then((group) =>
          group.isNicAdmin ? false : 'telecom.telephony.billingAccount',
        ),
  });
});
