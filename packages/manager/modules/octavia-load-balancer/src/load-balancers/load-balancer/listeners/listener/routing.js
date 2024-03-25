export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.listeners.listener',
    {
      url: '/:listenerId',
      resolve: {
        breadcrumb: () => null,
        listenerId: /* @ngInject */ ($transition$) =>
          $transition$.params().listenerId,
      },
      redirectTo: 'octavia-load-balancer.loadbalancer.listeners.listener.l7',
    },
  );
};
