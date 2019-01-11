angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.calls.externalNumber', {
    url: '/externalNumber',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/calls/externalNumber/telecom-telephony-line-calls-externalNumber.html',
        controller: 'TelecomTelephonyLineCallsExternalNumberCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.'],
  });
});
