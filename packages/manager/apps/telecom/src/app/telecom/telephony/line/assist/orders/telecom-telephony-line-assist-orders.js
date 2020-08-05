angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.line.dashboard.assist.orders',
      {
        url: '/orders',
        views: {
          'lineView@telecom.telephony.billingAccount.line.dashboard': {
            templateUrl:
              'app/telecom/telephony/service/assist/orders/telecom-telephony-service-assist-orders.html',
            controller: 'TelecomTelephonyServiceAssistOrdersCtrl',
            controllerAs: 'OrdersCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_line_assist_orders_breadcrumb'),
        },
        translations: {
          value: ['../../../service/assist/orders'],
          format: 'json',
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
