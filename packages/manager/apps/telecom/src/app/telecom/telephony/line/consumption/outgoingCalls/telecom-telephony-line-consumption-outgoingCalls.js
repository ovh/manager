angular
  .module('managerApp')
  .config(($stateProvider) => {
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
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant(
              'telephony_line_management_actions_line_consumption_outgoing_breadcrumb',
            ),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
