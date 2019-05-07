export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.privateNetwork.vrack.new', {
    url: '/new',
    component: 'pciProjectPrivateNetworksVrackCreate',
    layout: 'modal',
    resolve: {
      goBack: ($state, projectId) => () => $state.go('^', { projectId }),
      messageContainer: () => 'pci.projects.project.privateNetwork.vrack',
      onCreationSuccess: ($state, projectId) => () => $state.go('pci.projects.project.privateNetwork.vrack', { projectId }),
      onAssociationSuccess: ($state, projectId) => () => $state.go('pci.projects.project.privateNetwork', { projectId }),
    },
  });
};
