angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.consumption.outgoingFax',
      {
        url: '/outgoingFax',
        views: {
          'lineView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/line/consumption/outgoingFax/telecom-telephony-line-consumption-outgoingFax.html',
            controller: 'TelecomTelephonyLineConsumptionOutgoingFaxCtrl',
            controllerAs: '$ctrl',
          },
          'consumptionView@telecom.telephony.billingAccount.line.dashboard.consumption.outgoingFax': {
            templateUrl:
              'app/telecom/telephony/service/consumption/outgoingFax/telecom-telephony-service-consumption-outgoingFax.html',
            controller: 'TelecomTelephonyServiceConsumptionOutgoingFaxCtrl',
            controllerAs: '$ctrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant(
              'telephony_line_management_actions_line_consumption_outgoing_fax_breadcrumb',
            ),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
