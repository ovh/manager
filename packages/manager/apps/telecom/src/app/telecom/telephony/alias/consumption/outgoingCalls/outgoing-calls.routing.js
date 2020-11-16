export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.consumptionOutgoingCalls',
    {
      url: '/outgoingCalls',
      views: {
        'aliasInnerView@telecom.telephony.billingAccount.alias.details': {
          templateUrl:
            'app/telecom/telephony/service/consumption/outgoingCalls/outgoing-calls.html',
          controller: 'TelecomTelephonyServiceConsumptionOutgoingCallsCtrl',
          controllerAs: 'OutgoingCallsCtrl',
        },
      },
    },
  );
};
