angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.fax.dashboard.consumption.outgoingFax',
      {
        url: '/outgoingFax',
        views: {
          'faxView@telecom.telephony.billingAccount.fax.dashboard': {
            templateUrl:
              'app/telecom/telephony/fax/consumption/outgoingFax/telecom-telephony-fax-consumption-outgoingFax.html',
          },
          'consumptionView@telecom.telephony.billingAccount.fax.dashboard.consumption.outgoingFax': {
            templateUrl:
              'app/telecom/telephony/service/consumption/outgoingFax/telecom-telephony-service-consumption-outgoingFax.html',
            controller: 'TelecomTelephonyServiceConsumptionOutgoingFaxCtrl',
            controllerAs: '$ctrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant(
              'telephony_group_fax_consumption_outgoing_fax_breadcrumb',
            ),
        },
        translations: {
          value: [
            '../../../service/consumption',
            '../../../service/consumption/outgoingFax',
          ],
          format: 'json',
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
