export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.gateways.edit', {
    url: '/edit?gatewayId&region',
    component: 'pciProjectPublicGatewaysEdit',
    params: {
      gatewayId: {
        dynamic: true,
        type: 'string',
      },
      region: {
        dynamic: true,
        type: 'string',
      },
    },
    resolve: {
      gatewayId: /* @ngInject */ ($transition$) =>
        $transition$.params().gatewayId,
      region: /* @ngInject */ ($transition$) => $transition$.params().region,
      goBack: /* @ngInject */ (goToPublicGateway) => goToPublicGateway,
      breadcrumb: () => null,
    },
    atInternet: {
      rename: 'pci::projects::project::public-gateway::update',
    },
  });
};
