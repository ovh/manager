export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.privateNetwork', {
      url: '/network/private',
      component: 'pciProjectPrivateNetworks',
      resolve: {
        redirectToVrack: ($state, projectId) => operationId => $state.go('pci.projects.project.privateNetwork.vrack', { projectId, operationId }),
        redirectToVlans: ($state, projectId) => () => $state.go('pci.projects.project.privateNetwork.list', { projectId }),
        breadcrumb: /* @ngInject */ $translate => $translate.instant('pci_projects_project_network_private'),
      },
    });
};
