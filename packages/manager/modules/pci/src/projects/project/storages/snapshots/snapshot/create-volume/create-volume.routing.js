export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.snapshots.snapshot.create-volume',
    {
      url: '/new-volume',
      component: 'pciProjectStoragesSnapshotsCreateVolume',
      resolve: {
        goBack: /* @ngInject */ (
          $rootScope,
          CucCloudMessage,
          $state,
          projectId,
        ) => (message = false, type = 'success') => {
          const reload = message && type === 'success';

          const promise = $state.go(
            reload
              ? 'pci.projects.project.storages.blocks'
              : 'pci.projects.project.storages.snapshots',
            {
              projectId,
            },
            {
              reload,
            },
          );

          if (message) {
            promise.then(() =>
              CucCloudMessage[type](
                message,
                reload
                  ? 'pci.projects.project.storages.blocks'
                  : 'pci.projects.project.storages.snapshots',
              ),
            );
          }

          return promise;
        },
        cancelLink: /* @ngInject */ ($state, projectId) =>
          $state.href('pci.projects.project.storages.snapshots', {
            projectId,
          }),
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate
            .refresh()
            .then(() =>
              $translate.instant(
                'pci_projects_project_storages_snapshots_snapshot_create-volume_title',
              ),
            ),
      },
    },
  );
};
