export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.instance-backups.delete',
    {
      url: '/delete?instanceBackupId',
      views: {
        modal: {
          component: 'pciProjectStorageInstanceBackupsDelete',
        },
      },
      layout: 'modal',
      translations: {
        value: ['.'],
        format: 'json',
      },
      resolve: {
        instanceBackupId: /* @ngInject */ ($transition$) =>
          $transition$.params().instanceBackupId,
        instanceBackup: /* @ngInject */ (
          PciProjectStorageInstanceBackupService,
          projectId,
          instanceBackupId,
        ) =>
          PciProjectStorageInstanceBackupService.get(
            projectId,
            instanceBackupId,
          ),

        goBack: /* @ngInject */ (goToInstanceBackups) => goToInstanceBackups,
        breadcrumb: () => null,
      },
    },
  );
};
