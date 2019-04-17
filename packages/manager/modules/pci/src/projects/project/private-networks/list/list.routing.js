export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.privateNetwork.list', {
    url: '/list',
    views: {
      privateNetworkHeaderView: 'pciProjectPrivateNetworksHeader',
      privateNetworkView: 'pciProjectPrivateNetworksList',
    },
    resolve: {
      createNetwork: ($state, projectId) => () => $state.go('pci.projects.project.privateNetwork.add', { projectId }),
      deleteNetwork: ($state, projectId) => networkId => $state.go('pci.projects.project.privateNetwork.list.delete', { projectId, networkId }),
    },
  });
};
