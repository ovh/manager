export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('app.hosting.activate', {
    url: '/activate',
    component: 'webHostingEmailActivateComponent',
    resolve: {
      serviceName: /* @ngInject */ $transition$ => $transition$.params().productId,
      user: /* @ngInject */ User => User.getUser(),
      domainNames: /* @ngInject */ Hosting => Hosting.getHostings(),
    },
  });
};
