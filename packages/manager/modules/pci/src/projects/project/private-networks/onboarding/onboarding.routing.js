export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.privateNetwork.onboarding', {
    url: '/onboarding',
    component: 'pciProjectPrivateNetworksOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('privateNetworks')
        .then((privateNetworks) =>
          privateNetworks.length > 0
            ? { state: 'pci.projects.project.privateNetwork' }
            : false,
        ),
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb.
    },
    atInternet: {
      rename: 'PublicCloud::pci::projects::project::privateNetwork::onboarding',
    },
  });
};
