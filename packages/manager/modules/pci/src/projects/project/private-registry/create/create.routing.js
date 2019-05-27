export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.private-registry.create', {
      url: '/create',
      views: {
        modal: {
          component: 'pciProjectPrivateRegistryCreate',
        },
      },
      params: {
        fromState: null,
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */  goBackToState => goBackToState,
      },
    });
};
