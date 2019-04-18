export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.snapshots', {
      url: '/volume-snapshots',
      component: 'pciProjectStoragesSnapshots',
      resolve: {
        createVolume: /* @ngInject */ ($state, projectId) => snapshot => $state
          .go('pci.projects.project.storages.snapshots.snapshot.create-volume', {
            projectId,
            snapshotId: snapshot.id,
          }),
        createSnapshot: /* @ngInject */  ($state, projectId) => () => $state.go('pci.projects.project.storages.blocks', {
          projectId,
          help: 'snapshot',
        }),
        deleteSnapshot: /* @ngInject */ ($state, projectId) => snapshot => $state.go('pci.projects.project.storages.snapshots.delete', {
          projectId,
          snapshotId: snapshot.id,
        }),
        breadcrumb: /* @ngInject */ $translate => $translate
          .refresh()
          .then(() => $translate.instant('pci_projects_project_storages_snapshots_title')),
      },
    });
};
