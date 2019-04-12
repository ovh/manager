export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.privateNetwork.vrack', {
    url: '/vrack?operationId',
    views: {
      privateNetworkHeaderView: 'pciProjectPrivateNetworksHeader',
      privateNetworkView: 'pciProjectPrivateNetworksVrack',
    },
    params: {
      operationId: null,
    },
    resolve: {
      createVrack: ($state, projectId) => () => $state.go('pci.projects.project.privateNetwork.vrack.new', { projectId }),
      onVrackCreated: ($state, projectId) => () => $state.go('pci.projects.project.privateNetwork.list', { projectId }),
      operationId: $transition$ => $transition$.params().operationId,
    },
  });
};
