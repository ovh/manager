export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.blocks.onboarding', {
      url: '/onboarding',
      component: 'pciProjectStorageBlocksOnboarding',
      resolve: {
        breadcrumb: () => null, // Hide breadcrumb
        addBlockStorage: /* @ngInject */ ($state, projectId) => () => $state.go('pci.projects.project.storages.blocks.add', {
          projectId,
        }),
      },
    });
};
