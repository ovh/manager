angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.alias.details.consumptionOutgoingCalls',
      {
        url: '/outgoingCalls',
        views: {
          'aliasInnerView@telecom.telephony.billingAccount.alias.details': {
            templateUrl:
              'app/telecom/telephony/service/consumption/outgoingCalls/telecom-telephony-service-consumption-outgoingCalls.html',
            controller: 'TelecomTelephonyServiceConsumptionOutgoingCallsCtrl',
            controllerAs: 'OutgoingCallsCtrl',
          },
        },
        translations: {
          value: [
            '..',
            '../../../service/consumption/',
            '../../../service/consumption/outgoingCalls',
          ],
          format: 'json',
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant(
              'telephony_alias_consumption_outgoing_calls_breadcrumb',
            ),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
