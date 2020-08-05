angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.fax.dashboard.assist.orders',
      {
        url: '/orders',
        views: {
          'faxView@telecom.telephony.billingAccount.fax.dashboard': {
            templateUrl:
              'app/telecom/telephony/service/assist/orders/telecom-telephony-service-assist-orders.html',
            controller: 'TelecomTelephonyServiceAssistOrdersCtrl',
            controllerAs: 'OrdersCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_fax_assist_orders_breadcrumb'),
        },
        translations: {
          value: ['../../../service/assist/orders'],
          format: 'json',
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
