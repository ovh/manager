export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('telecom.pack.xdsl.access-modem-exchange', {
      url: '/comfortExchange',
      views: {
        'accessView@telecom.pack.xdsl': 'xdslAccessComfortExchange',
      },
      resolve: {
        xdslId: /* @ngInject */ $transition$ => $transition$.params().serviceName,
        openedRMAs: /* @ngInject */ (
          XdslAccessComfortExchangeService,
          xdslId,
        ) => XdslAccessComfortExchangeService.getOpenedRMAs(xdslId),
      },
      translations: { value: ['..', '.'], format: 'json' },
    });
};
