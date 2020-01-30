export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.blocks.onboarding', {
    url: '/onboarding',
    component: 'pciProjectStorageBlocksOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('storages')
        .then((storages) =>
          storages.length > 0
            ? { state: 'pci.projects.project.storages.blocks' }
            : false,
        ),
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
      addBlockStorage: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.storages.blocks.add', {
          projectId,
        }),
    },
  });
};
