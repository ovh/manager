export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.snapshots.onboarding', {
      url: '/onboarding',
      component: 'pciProjectStorageSnapshotsOnboarding',
      redirectTo: (transition) => transition
        .injector()
        .getAsync('snapshots')
        .then((snapshots) => (snapshots.length > 0 ? { state: 'pci.projects.project.storages.snapshots' } : false)),
      resolve: {
        breadcrumb: () => null, // Hide breadcrumb
        addSnapshot: /* @ngInject */ ($state, projectId) => () => $state.go('pci.projects.project.storages.blocks', {
          projectId,
          help: 'snapshot',
        }),
      },
    });
};
