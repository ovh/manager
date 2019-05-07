export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.snapshots.onboarding', {
      url: '/onboarding',
      component: 'pciProjectStorageSnapshotsOnboarding',
      resolve: {
        breadcrumb: () => null, // Hide breadcrumb
        addSnapshot: /* @ngInject */ ($state, projectId) => () => $state.go('pci.projects.project.storages.blocks', {
          projectId,
          help: 'snapshot',
        }),
      },
      translations: {
        value: ['.'],
        format: 'json',
      },
    });
};
