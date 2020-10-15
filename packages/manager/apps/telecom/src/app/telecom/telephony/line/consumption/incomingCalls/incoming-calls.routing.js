import template from './incoming-calls.html';
import controller from './incoming-calls.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.consumption.incomingCalls',
    {
      url: '/incomingCalls',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          template,
          controller,
          controllerAs: 'LineIncomingCallsCtrl',
        },
        'consumptionView@telecom.telephony.billingAccount.line.consumption.incomingCalls': {
          templateUrl:
            'app/telecom/telephony/service/consumption/incomingCalls/incoming-calls.html',
          controller: 'TelecomTelephonyServiceConsumptionIncomingCallsCtrl',
          controllerAs: 'IncomingCallsCtrl',
        },
      },
    },
  );
};
