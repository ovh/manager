export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.instance-backups', {
      url: '/instance-backups',
      component: 'pciProjectStorageInstanceBackups',
      resolve: {
        addInstanceBackup: /* @ngInject */($state, projectId) => () => $state.go('pci.projects.project.instances', {
          projectId,
        }),
        createInstance: /* @ngInject */ ($state, projectId) => instanceBackup => $state.go('pci.projects.project.storages.instance-backups.create', {
          projectId,
          instanceBackupId: instanceBackup.id,
        }),
        deleteInstanceBackup: /* @ngInject */ ($state, projectId) => instanceBackup => $state.go('pci.projects.project.storages.instance-backups.delete', {
          projectId,
          instanceBackupId: instanceBackup.id,
        }),
      },
    });
};
