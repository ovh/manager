angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.click2call.addUser', {
    url: '/add',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/calls/click2Call/add-user/telecom-telephony-line-calls-click2Call-add-user.html',
        controller: 'TelecomTelephonyLineClick2CallAddUserCtrl',
        controllerAs: 'Click2CallAddUserCtrl',
      },
    },
    translations: ['.'],
  });
});
