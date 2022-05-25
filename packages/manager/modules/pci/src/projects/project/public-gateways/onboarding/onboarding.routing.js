export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.public-gateways.onboarding', {
    url: '/onboarding',
    component: 'pciProjectPublicGatewaysOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('gateways')
        .then((gateways) =>
          gateways.length > 0
            ? { state: 'pci.projects.project.public-gateways' }
            : false,
        ),
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb.
    },
    atInternet: {
      rename: 'PublicCloud::pci::projects::project::public-gateway::onboarding',
    },
  });
};
