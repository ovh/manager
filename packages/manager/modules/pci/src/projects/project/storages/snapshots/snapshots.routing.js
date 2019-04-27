export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.snapshots', {
      url: '/volume-snapshots',
      component: 'pciProjectStoragesSnapshots',
      resolve: {
        snapshots: /* @ngInject */ (
          PciProjectStorageSnapshotsService,
          projectId,
        ) => PciProjectStorageSnapshotsService.getAll(projectId),
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

        goToSnapshots: /* @ngInject */ ($rootScope, CucCloudMessage, $state, projectId) => (message = false, type = 'success') => {
          const reload = message && type === 'success';

          const promise = $state.go('pci.projects.project.storages.snapshots', {
            projectId,
          },
          {
            reload,
          });

          if (message) {
            promise.then(() => CucCloudMessage[type](message, 'pci.projects.project.storages.snapshots'));
          }

          return promise;
        },


        breadcrumb: /* @ngInject */ $translate => $translate
          .refresh()
          .then(() => $translate.instant('pci_projects_project_storages_snapshots_title')),
      },
    });
};
