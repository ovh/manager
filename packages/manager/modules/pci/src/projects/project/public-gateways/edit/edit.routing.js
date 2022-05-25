export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.public-gateways.edit', {
    url: '/edit',
    component: 'pciProjectPublicGatewaysEdit',
    params: { gateway: null },
    resolve: {
      gateway: /* @ngInject */ ($transition$) => $transition$.params().gateway,
      goBack: /* @ngInject */ (goToPublicGateway) => goToPublicGateway,
      breadcrumb: () => null,
    },
    atInternet: {
      rename: 'PublicCloud::pci::projects::project::public-gateway::update',
    },
  });
};
