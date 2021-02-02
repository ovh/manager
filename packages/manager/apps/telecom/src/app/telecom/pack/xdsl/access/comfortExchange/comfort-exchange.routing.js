export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl.line.access-modem-exchange', {
    url: '/comfortExchange',
    views: {
      'accessView@telecom.packs.pack.xdsl.line': 'xdslAccessComfortExchange',
    },
    resolve: {
      xdslId: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      packName: /* @ngInject */ ($transition$) =>
        $transition$.params().packName,
      openedRMAs: /* @ngInject */ (XdslAccessComfortExchangeService, xdslId) =>
        XdslAccessComfortExchangeService.getOpenedRMAs(xdslId),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('xdsl_access_comfort_exchange_title'),
    },
    translations: { value: ['..'], format: 'json' },
  });
};
