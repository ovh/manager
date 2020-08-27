angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.consumption.outgoingCalls',
    {
      url: '/outgoingCalls',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          templateUrl:
            'app/telecom/telephony/line/consumption/outgoingCalls/telecom-telephony-line-consumption-outgoingCalls.html',
          controller: 'TelecomTelephonyLineConsumptionOutgoingCallsCtrl',
          controllerAs: 'LineOutgoingCallsCtrl',
        },
        'consumptionView@telecom.telephony.billingAccount.line.dashboard.consumption.outgoingCalls': {
          templateUrl:
            'app/telecom/telephony/service/consumption/outgoingCalls/telecom-telephony-service-consumption-outgoingCalls.html',
          controller: 'TelecomTelephonyServiceConsumptionOutgoingCallsCtrl',
          controllerAs: 'OutgoingCallsCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
