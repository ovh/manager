import template from './outgoing-calls.html';
import controller from './outgoing-calls.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.consumption.outgoingCalls',
    {
      url: '/outgoingCalls',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          controller,
          controllerAs: 'LineOutgoingCallsCtrl',
        },
        'consumptionView@telecom.telephony.billingAccount.line.dashboard.consumption.outgoingCalls': {
          templateUrl:
            'app/telecom/telephony/service/consumption/outgoingCalls/outgoing-calls.html',
          controller: 'TelecomTelephonyServiceConsumptionOutgoingCallsCtrl',
          controllerAs: 'OutgoingCallsCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'telephony_line_management_actions_line_consumption_outgoing_breadcrumb',
          ),
      },
    },
  );
};
