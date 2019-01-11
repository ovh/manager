angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.calls.events', {
    url: '/events',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/calls/events/telecom-telephony-line-calls-events.html',
        controller: 'TelecomTelephonyLineCallsEventsCtrl',
        controllerAs: 'EventsCtrl',
      },
    },
    translations: ['.'],
  });
});
