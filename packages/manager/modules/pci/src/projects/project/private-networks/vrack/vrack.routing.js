export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.privateNetwork.vrack', {
    url: '/onboarding',
    component: 'pciProjectPrivateNetworksVrack',
    resolve: {
      createVrack: ($state, projectId) => () => $state.go('pci.projects.project.privateNetwork.vrack.new', { projectId }),
      onVrackCreated: ($state, projectId) => () => $state.go('pci.projects.project.privateNetwork', { projectId }),

      breadcrumb: /* @ngInject */ $translate => $translate.instant('pci_projects_project_network_private'),
    },
  });
};
