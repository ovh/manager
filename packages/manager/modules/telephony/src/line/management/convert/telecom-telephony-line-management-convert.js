angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.convert', {
    url: '/convert',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/management/convert/telecom-telephony-line-management-convert.html',
        controller: 'TelecomTelephonyLineConvertCtrl',
        controllerAs: 'LineConvertCtrl',
      },
    },
    translations: ['.'],
  });
});
