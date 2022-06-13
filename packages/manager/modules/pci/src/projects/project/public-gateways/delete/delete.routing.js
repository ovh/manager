export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.public-gateways.delete', {
    url: '/delete',
    params: { gateway: null },
    views: {
      modal: {
        component: 'pciProjectPublicGatewaysDelete',
      },
    },
    resolve: {
      goBack: /* @ngInject */ (goToPublicGateway) => goToPublicGateway,
      gateway: /* @ngInject */ ($transition$) => $transition$.params().gateway,
      breadcrumb: () => null,
    },
    layout: 'modal',
    atInternet: {
      rename: 'PublicCloud::pci::projects::project::public-gateway::delete',
    },
  });
};
