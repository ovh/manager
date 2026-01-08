export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.private-config-funnel', {
    url: '/private-config-funnel',
    views: {
      '@exchange': 'exchangePrivateConfigFunnelComponent',
    },
    resolve: {
      hideBreadcrumb: () => true,
    },
  });
};
