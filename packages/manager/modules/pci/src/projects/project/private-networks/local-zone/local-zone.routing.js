export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.privateNetwork.localZone', {
    url: '/localZone',
    views: {
      containersView: 'pciPrivateNetworksLocalZone',
    },
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
