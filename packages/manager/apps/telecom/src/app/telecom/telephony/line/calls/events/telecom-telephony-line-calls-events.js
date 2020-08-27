angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.calls.events',
    {
      url: '/events',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          templateUrl:
            'app/telecom/telephony/line/calls/events/telecom-telephony-line-calls-events.html',
          controller: 'TelecomTelephonyLineCallsEventsCtrl',
          controllerAs: 'EventsCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
