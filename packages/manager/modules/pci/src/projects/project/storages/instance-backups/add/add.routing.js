import find from 'lodash/find';
import filter from 'lodash/filter';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.instance-backups.add', {
    url: '/new?instanceBackupId',
    component: 'ovhManagerPciInstancesBackupsAdd',
    params: {
      instanceBackupId: null,
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_instances_backup_add_title'),

      backupId: /* @ngInject */ ($transition$) =>
        $transition$.params().instanceBackupId,

      backup: /* @ngInject */ (
        backupId,
        PciProjectStorageInstanceBackupService,
        projectId,
      ) => PciProjectStorageInstanceBackupService.get(projectId, backupId),

      quota: /* @ngInject */ (backup, OvhApiCloudProjectQuota, projectId) =>
        OvhApiCloudProjectQuota.v6()
          .query({
            serviceName: projectId,
          })
          .$promise.then((quota) => find(quota, { region: backup.region })),

      quotaLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.quota', {
          projectId,
        }),

      publicNetwork: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
      ) => PciProjectsProjectInstanceService.getPublicNetwork(projectId),

      privateNetworks: /* @ngInject */ (
        backup,
        PciProjectsProjectInstanceService,
        projectId,
      ) =>
        PciProjectsProjectInstanceService.getPrivateNetworks(
          projectId,
        ).then((networks) =>
          filter(
            networks,
            ({ status, regions }) =>
              status === 'ACTIVE' && find(regions, { region: backup.region }),
          ),
        ),

      goBack: /* @ngInject */ (goToInstanceBackups) => goToInstanceBackups,
    },
  });
};
