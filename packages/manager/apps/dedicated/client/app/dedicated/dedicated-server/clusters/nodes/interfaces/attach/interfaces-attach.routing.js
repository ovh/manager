export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-cluster.cluster.node.interfaces.attach', {
    url: '/attach',
    views: {
      modal: {
        component: 'dedicatedServerInterfacesAttach',
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
      vracks: /* @ngInject */ (OvhApiVrack) => OvhApiVrack.v6().query(),
      breadcrumb: () => null,
    },
  });
};
