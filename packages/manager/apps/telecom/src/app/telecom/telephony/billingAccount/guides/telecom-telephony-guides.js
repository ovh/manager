angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.guides', {
    url: '/guides',
    views: {
      'groupInnerView@telecom.telephony.billingAccount': {
        templateUrl:
          'app/telecom/telephony/billingAccount/guides/telecom-telephony-guides.html',
        controller: 'TelecomTelephonyGuidesCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['.', '../guides'], format: 'json' },
  });
});
