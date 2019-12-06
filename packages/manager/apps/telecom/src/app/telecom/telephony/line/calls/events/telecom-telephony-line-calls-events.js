angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.calls.events', {
    url: '/events',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        templateUrl: 'app/telecom/telephony/line/calls/events/telecom-telephony-line-calls-events.html',
        controller: 'TelecomTelephonyLineCallsEventsCtrl',
        controllerAs: 'EventsCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
