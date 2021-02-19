export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.consumptionIncomingCalls',
    {
      url: '/incomingCalls',
      views: {
        'aliasInnerView@telecom.telephony.billingAccount.alias.details': {
          templateUrl:
            'app/telecom/telephony/service/consumption/incomingCalls/incoming-calls.html',
          controller: 'TelecomTelephonyServiceConsumptionIncomingCallsCtrl',
          controllerAs: 'IncomingCallsCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'telephony_alias_consumption_incoming_calls_breadcrumb',
          ),
      },
    },
  );
};
