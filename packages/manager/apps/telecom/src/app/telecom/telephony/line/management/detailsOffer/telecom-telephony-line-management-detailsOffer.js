angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.detailsOffer', {
    url: '/detailsOffer',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        templateUrl: 'app/telecom/telephony/line/management/detailsOffer/telecom-telephony-line-management-detailsOffer.html',
      },
      'detailsView@telecom.telephony.billingAccount.line.detailsOffer': {
        templateUrl: 'app/telecom/telephony/line/details/telecom-telephony-line-details.html',
        controller: 'TelecomTelephonyLineDetailsCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
