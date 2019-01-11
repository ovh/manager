angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.phone.details', {
    url: '/details',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/phone/details/telecom-telephony-line-phone-details.html',
      },
      'detailsView@telecom.telephony.line.phone.details': {
        templateUrl: 'app/telecom/telephony/line/details/telecom-telephony-line-details.html',
        controller: 'TelecomTelephonyLineDetailsCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.'],
  });
});
