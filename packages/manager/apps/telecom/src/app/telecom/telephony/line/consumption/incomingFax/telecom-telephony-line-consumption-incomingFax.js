angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.consumption.incomingFax',
      {
        url: '/incomingFax',
        views: {
          'lineView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/line/consumption/incomingFax/telecom-telephony-line-consumption-incomingFax.html',
            controller: 'TelecomTelephonyLineConsumptionIncomingFaxCtrl',
            controllerAs: '$ctrl',
          },
          'consumptionView@telecom.telephony.billingAccount.line.dashboard.consumption.incomingFax': {
            templateUrl:
              'app/telecom/telephony/service/consumption/incomingFax/telecom-telephony-service-consumption-incomingFax.html',
            controller: 'TelecomTelephonyServiceConsumptionIncomingFaxCtrl',
            controllerAs: '$ctrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant(
              'telephony_line_management_actions_line_consumption_incoming_fax_breadcrumb',
            ),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
