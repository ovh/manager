export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-cluster.cluster.node.interfaces.ola-activation',
    {
      url: '/ola-activation',
      translations: { value: ['.'], format: 'json' },
      views: {
        modal: {
          component: 'dedicatedServerInterfacesOlaActivation',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ ($state) => (params) =>
          $state.go('app.dedicated-cluster.cluster.node.interfaces', params),
        trackingPrefix: () => 'dedicated::server::interfaces::',
        breadcrumb: () => null,
      },
    },
  );
};
