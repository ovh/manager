angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.calls.filtering', {
    url: '/filtering',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/calls/filtering/telecom-telephony-line-calls-filtering.html',
        controller: 'TelecomTelephonyLineCallsFilteringCtrl',
        controllerAs: 'CallsFilteringCtrl',
      },
    },
    translations: ['.'],
  });
});
