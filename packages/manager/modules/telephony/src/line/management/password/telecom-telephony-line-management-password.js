angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.password', {
    url: '/password',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/management/password/telecom-telephony-line-management-password.html',
        controller: 'TelecomTelephonyLinePasswordCtrl',
        controllerAs: 'PasswordCtrl',
      },
    },
    translations: ['.'],
  });
});
