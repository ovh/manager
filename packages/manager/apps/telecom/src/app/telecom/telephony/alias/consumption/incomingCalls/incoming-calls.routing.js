export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.consumptionIncomingCalls',
    {
      url: '/incomingCalls',
      views: {
        'aliasInnerView@telecom.telephony.billingAccount.alias': {
          templateUrl:
            'app/telecom/telephony/service/consumption/incomingCalls/incoming-calls.html',
          controller: 'TelecomTelephonyServiceConsumptionIncomingCallsCtrl',
          controllerAs: 'IncomingCallsCtrl',
        },
      },
    },
  );
};
