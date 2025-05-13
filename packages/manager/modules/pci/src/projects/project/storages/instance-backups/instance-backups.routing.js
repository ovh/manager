import { PCI_FEATURES } from '../../../projects.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.instance-backups', {
    url: '/instance-backups?id',
    component: 'pciProjectStorageInstanceBackups',
    translations: {
      value: ['.'],
      format: 'json',
    },
    params: {
      id: {
        dynamic: true,
        type: 'string',
      },
    },
    onEnter: /* @ngInject */ (pciFeatureRedirect) => {
      return pciFeatureRedirect(PCI_FEATURES.PRODUCTS.INSTANCE_BACKUP);
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('instanceBackups')
        .then((instanceBackups) =>
          instanceBackups.length === 0
            ? {
                state:
                  'pci.projects.project.storages.instance-backups.onboarding',
              }
            : false,
        ),
    resolve: {
      backupId: /* @ngInject */ ($transition$) => $transition$.params().id,

      instanceBackups: /* @ngInject */ (
        PciProjectStorageInstanceBackupService,
        projectId,
      ) => PciProjectStorageInstanceBackupService.getAll(projectId),

      instanceBackupsRegions: /* @ngInject */ (instanceBackups) =>
        Array.from(new Set(instanceBackups.map(({ region }) => region))),

      goToInstanceBackups: /* @ngInject */ (
        $state,
        CucCloudMessage,
        projectId,
      ) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.storages.instance-backups',
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
              'pci.projects.project.storages.instance-backups',
            ),
          );
        }

        return promise;
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate
          .refresh()
          .then(() =>
            $translate.instant(
              'pci_projects_project_storages_instance-backups_title',
            ),
          ),

      addInstanceBackup: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.instances', {
          projectId,
          help: 'backup',
        }),
      createInstance: /* @ngInject */ ($state, projectId) => (instanceBackup) =>
        $state.go('pci.projects.project.storages.instance-backups.add', {
          projectId,
          instanceBackupId: instanceBackup.id,
        }),
      deleteInstanceBackup: /* @ngInject */ ($state, projectId) => (
        instanceBackup,
      ) =>
        $state.go('pci.projects.project.storages.instance-backups.delete', {
          projectId,
          instanceBackupId: instanceBackup.id,
        }),
    },
  });
};
