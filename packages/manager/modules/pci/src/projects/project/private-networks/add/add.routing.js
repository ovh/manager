export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.privateNetwork.add', {
    url: '/new',
    views: {
      privateNetworkView: 'pciProjectPrivateNetworksAdd',
    },
    resolve: {
      goBack: ($state, projectId) => () => $state.go('pci.projects.project.privateNetwork.list', { projectId }),
      messageContainer: () => 'pci.projects.project.privateNetwork.list',
    },
  });
};
