export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.gateways.onboarding', {
    url: '/onboarding',
    component: 'pciProjectPublicGatewaysOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('gateways')
        .then((gateways) =>
          gateways.length > 0
            ? { state: 'pci.projects.project.gateways' }
            : false,
        ),
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb.
    },
    atInternet: {
      rename: 'pci::projects::project::public-gateway::onboarding',
    },
  });
};
