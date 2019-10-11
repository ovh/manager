export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.cdn.order', {
    url: '/order',
    translations: { value: ['.'], format: 'json' },
    component: 'hostingCdnOrder',
    resolve: {
      goBack: /* @ngInject */ $state => () => $state.go('app.hosting'),

      hosting: /* @ngInject */ (productId, Hosting) => Hosting.getSelected(productId),
      hostingProxy: /* @ngInject */ (productId, Hosting) => Hosting.getHosting(productId),
      productId: /* @ngInject */ $transition$ => $transition$.params().productId,

      isPerfOffer: /* @ngInject */ (hostingProxy, Hosting) => () => Hosting
        .constructor
        .isPerfOffer(hostingProxy.offer),
    },
  });
};
