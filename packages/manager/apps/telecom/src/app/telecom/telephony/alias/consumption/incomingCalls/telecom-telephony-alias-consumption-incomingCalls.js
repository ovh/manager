angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.consumptionIncomingCalls',
    {
      url: '/incomingCalls',
      views: {
        'aliasInnerView@telecom.telephony.billingAccount.alias.details': {
          templateUrl:
            'app/telecom/telephony/service/consumption/incomingCalls/telecom-telephony-service-consumption-incomingCalls.html',
          controller: 'TelecomTelephonyServiceConsumptionIncomingCallsCtrl',
          controllerAs: 'IncomingCallsCtrl',
        },
      },
      translations: {
        value: [
          '..',
          '../../../service/consumption/',
          '../../../service/consumption/incomingCalls',
        ],
        format: 'json',
      },
    },
  );
});
