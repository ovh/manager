angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.offerChange', {
    url: '/offerChange',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/management/offerChange/telecom-telephony-line-management-offer-change.html',
        controller: 'TelecomTelephonyLineManagementOfferChangeCtrl',
        controllerAs: 'OfferChangeCtrl',
      },
    },
    translations: ['.'],
  });
});
