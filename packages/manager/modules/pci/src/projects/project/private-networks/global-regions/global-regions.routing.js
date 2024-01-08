export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.privateNetwork.globalRegions', {
    url: '',
    views: {
      containersView: 'pciPrivateNetworksGlobalRegions',
    },
    resolve: {
      gotoDeleteSubnet: /* @ngInject */ (
        $state,
        projectId,
        trackPrivateNetworks,
      ) => (networkId, region) => {
        trackPrivateNetworks(`table-option-menu::delete`);
        return $state.go(
          'pci.projects.project.privateNetwork.globalRegions.delete',
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
      rename: 'pci::projects::project::privateNetwork::globalRegions',
    },
  });
};
