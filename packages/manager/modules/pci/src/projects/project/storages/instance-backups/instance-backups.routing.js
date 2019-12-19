export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.instance-backups', {
      url: '/instance-backups',
      component: 'pciProjectStorageInstanceBackups',
      translations: {
        value: ['.'],
        format: 'json',
      },
      redirectTo: (transition) => transition
        .injector()
        .getAsync('instanceBackups')
        .then((instanceBackups) => (instanceBackups.length === 0 ? { state: 'pci.projects.project.storages.instance-backups.onboarding' } : false)),
      resolve: {
        instanceBackups: /* @ngInject */ (
          PciProjectStorageInstanceBackupService,
          projectId,
        ) => PciProjectStorageInstanceBackupService
          .getAll(projectId),

        goToInstanceBackups: /* @ngInject */ ($state, CucCloudMessage, projectId) => (message = false, type = 'success') => {
          const reload = message && type === 'success';

          const promise = $state.go('pci.projects.project.storages.instance-backups', {
            projectId,
          },
          {
            reload,
          });

          if (message) {
            promise.then(() => CucCloudMessage[type](message, 'pci.projects.project.storages.instance-backups'));
          }

          return promise;
        },
        breadcrumb: /* @ngInject */ ($translate) => $translate
          .refresh()
          .then(() => $translate.instant('pci_projects_project_storages_instance-backups_title')),

        addInstanceBackup: /* @ngInject */($state, projectId) => () => $state.go('pci.projects.project.instances', {
          projectId,
          help: 'backup',
        }),
        createInstance: /* @ngInject */ ($state, projectId) => (instanceBackup) => $state.go('pci.projects.project.storages.instance-backups.add', {
          projectId,
          instanceBackupId: instanceBackup.id,
        }),
        deleteInstanceBackup: /* @ngInject */ ($state, projectId) => (instanceBackup) => $state.go('pci.projects.project.storages.instance-backups.delete', {
          projectId,
          instanceBackupId: instanceBackup.id,
        }),
      },
    });
};
