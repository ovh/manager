export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.privateNetwork.localZone', {
    url: '/localZone',
    views: {
      containersView: 'pciPrivateNetworksLocalZone',
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('localPrivateNetworks')
        .then((localPrivateNetworks) =>
          !localPrivateNetworks.length
            ? { state: 'pci.projects.project.privateNetwork' }
            : false,
        ),
    resolve: {
      gotoDeleteSubnet: /* @ngInject */ (
        $state,
        projectId,
        trackPrivateNetworks,
      ) => (networkId, region) => {
        trackPrivateNetworks(`table-option-menu::delete`);
        return $state.go(
          'pci.projects.project.privateNetwork.localZone.delete',
          {
            projectId,
            networkId,
            region,
          },
        );
      },
      breadcrumb: /* @ngInject */ () => null,
    },
    atInternet: {
      rename: 'pci::projects::project::privateNetwork::localZone',
    },
  });
};
