angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.guides', {
    url: '/guides',
    views: {
      'groupInnerView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/billingAccount/guides/telecom-telephony-guides.html',
        controller: 'TelecomTelephonyGuidesCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['.', '../guides'], format: 'json' },
  });
});
