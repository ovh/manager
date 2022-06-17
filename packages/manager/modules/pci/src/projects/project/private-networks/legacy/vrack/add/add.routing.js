export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.privateNetwork.vrack.new', {
    url: '/new',
    component: 'pciProjectPrivateNetworksVrackCreate',
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ ($state, projectId) => () =>
        $state.go('^', { projectId }),
      messageContainer: () => 'pci.projects.project.privateNetwork.vrack',
      onCreationSuccess: /* @ngInject */ ($state, projectId) => () =>
        $state.go(
          'pci.projects.project.privateNetwork.vrack',
          { projectId },
          { reload: true },
        ),
      onAssociationSuccess: /* @ngInject */ ($state, projectId) => () =>
        $state.go(
          'pci.projects.project.privateNetwork',
          { projectId },
          { reload: true },
        ),
      breadcrumb: () => null,
    },
  });
};
