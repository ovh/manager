import template from './incoming-calls.html';
import controller from './incoming-calls.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.consumption.incomingCalls',
    {
      url: '/incomingCalls',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          controller,
          controllerAs: 'LineIncomingCallsCtrl',
        },
        'consumptionView@telecom.telephony.billingAccount.line.dashboard.consumption.incomingCalls': {
          templateUrl:
            'app/telecom/telephony/service/consumption/incomingCalls/incoming-calls.html',
          controller: 'TelecomTelephonyServiceConsumptionIncomingCallsCtrl',
          controllerAs: 'IncomingCallsCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'telephony_line_management_actions_line_consumption_incoming_breadcrumb',
          ),
      },
    },
  );
};
