export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.interfaces.ola-terminate', {
    url: '/ola-terminate',
    translations: { value: ['.'], format: 'json' },
    views: {
      modal: {
        component: 'dedicatedServerInterfacesOlaTerminate',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ ($state) => (params) =>
        $state.go('app.dedicated-server.server.interfaces', params),
      breadcrumb: () => null,
    },
  });
};
