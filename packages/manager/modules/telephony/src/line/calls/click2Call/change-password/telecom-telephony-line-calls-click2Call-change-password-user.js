angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.click2call.changePassword', {
    url: '/modify/:userId',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/calls/click2Call/change-password/telecom-telephony-line-calls-click2Call-change-password.html',
        controller: 'TelecomTelephonyLineClick2CallChangePasswordCtrl',
        controllerAs: 'Click2CallChangePasswordCtrl',
      },
    },
    translations: ['.'],
  });
});
