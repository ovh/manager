export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.private-registry.create', {
      url: '/create',
      views: {
        modal: {
          component: 'pciProjectPrivateRegistryCreate',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */  goBackToList => goBackToList,
      },
    });
};
