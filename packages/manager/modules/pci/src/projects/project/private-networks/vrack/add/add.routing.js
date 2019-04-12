export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.privateNetwork.vrack.new', {
    url: '/new',
    component: 'pciProjectPrivateNetworksVrackCreate',
    layout: 'modal',
    resolve: {
      goBack: ($state, projectId) => () => $state.go('^', { projectId }),
      messageContainer: () => 'pci.projects.project.privateNetwork.vrack',
      onCreationSuccess: ($state, projectId) => operationId => $state.go('pci.projects.project.privateNetwork.vrack', { projectId, operationId }),
      onAssociationSuccess: ($state, projectId) => () => $state.go('pci.projects.project.privateNetwork.list', { projectId }),
    },
  });
};
