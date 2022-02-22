import find from 'lodash/find';
import filter from 'lodash/filter';

import { FLAVORS_FEATURES_FLIPPING_MAP } from '../../../instances/instances.constants';
import { EXCLUDE_FLAVOR_CATEGORIES } from '../../../instances/add/add.constants';

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

      excludeCategories: /* @ngInject */ (pciFeatures) => {
        const flavorCategories = Object.keys(FLAVORS_FEATURES_FLIPPING_MAP);
        const toExclude = flavorCategories.filter((flavor) => {
          return !pciFeatures.isFeatureAvailable(
            FLAVORS_FEATURES_FLIPPING_MAP[flavor],
          );
        });

        return EXCLUDE_FLAVOR_CATEGORIES.concat(toExclude);
      },

      goBack: /* @ngInject */ (goToInstanceBackups) => goToInstanceBackups,
    },
  });
};
