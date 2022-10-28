export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.gateways.delete', {
    url: '/delete?id&name&region',
    layout: 'modal',
    views: {
      modal: {
        component: 'pciProjectPublicGatewaysDelete',
      },
    },
    params: {
      id: {
        dynamic: true,
        type: 'string',
      },
      name: {
        dynamic: true,
        type: 'string',
      },
      region: {
        dynamic: true,
        type: 'string',
      },
    },
    resolve: {
      goBack: /* @ngInject */ (goToPublicGateway) => goToPublicGateway,
      id: /* @ngInject */ ($transition$) => $transition$.params().id,
      name: /* @ngInject */ ($transition$) => $transition$.params().name,
      region: /* @ngInject */ ($transition$) => $transition$.params().region,
      breadcrumb: () => null,
    },
    atInternet: {
      rename: 'pci::projects::project::public-gateway::delete',
    },
  });
};
