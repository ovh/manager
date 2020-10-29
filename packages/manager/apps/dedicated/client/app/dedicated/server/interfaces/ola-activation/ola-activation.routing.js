export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.interfaces.ola-activation', {
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
        $state.go('app.dedicated.server.interfaces', params),
      trackingPrefix: () => 'dedicated::server::interfaces::',
    },
  });
};
