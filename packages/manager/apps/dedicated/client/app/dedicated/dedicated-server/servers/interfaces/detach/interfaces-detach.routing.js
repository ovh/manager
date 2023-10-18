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
    resolve: {
      goBack: /* @ngInject */ (goToInterfaces) => goToInterfaces,
      interface: /* @ngInject */ ($transition$) =>
        $transition$.params().interface,
      breadcrumb: () => null,
    },
  });
};
