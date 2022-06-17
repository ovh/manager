export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.privateNetwork.add', {
    url: '/new',
    component: 'pciProjectPrivateNetworksAdd',
    resolve: {
      goBack: /* @ngInject */ (goToPrivateNetworks) => goToPrivateNetworks,
      messageContainer: () => 'pci.projects.project.privateNetwork',

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_network_private_create'),
    },
  });
};
