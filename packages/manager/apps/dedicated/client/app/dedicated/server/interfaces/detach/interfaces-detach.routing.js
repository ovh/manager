export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.interfaces.detach', {
    url: '/detach',
    views: {
      modal: {
        component: 'dedicatedServerInterfacesDetach',
      },
    },
    params: {
      interface: null,
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      interface: /* @ngInject */ ($transition$) =>
        $transition$.params().interface,
    },
  });
};
