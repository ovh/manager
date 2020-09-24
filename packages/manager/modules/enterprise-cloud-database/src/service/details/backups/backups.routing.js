import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';

import { STATUS } from '../../../enterprise-cloud-database.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('enterprise-cloud-database.service.details.backups', {
    url: '/backups',
    cache: false,
    component: 'enterpriseCloudDatabaseServiceDetailsBackupsComponent',
    resolve: {
      /* @ngInject */
      backupList: (clusterId, enterpriseCloudDatabaseService) =>
        enterpriseCloudDatabaseService
          .getBackups(clusterId)
          .then((backups) => map(backups, (backup) => ({ id: backup }))),
      backupPrice: /* @ngInject */ (catalog) =>
        get(find(catalog.addons, { planCode: 'backup' }), 'pricings[0]'),
      /* @ngInject */
      getBackupDetails: (clusterId, enterpriseCloudDatabaseService) => (
        backupId,
      ) => enterpriseCloudDatabaseService.getBackupDetails(clusterId, backupId),
      goBackToBackups: /* @ngInject */ ($state, CucCloudMessage) => (
        message = false,
        type = STATUS.SUCCESS,
      ) => {
        const reload = message && type === STATUS.SUCCESS;
        const state = 'enterprise-cloud-database.service.details.backups';
        const promise = $state.go(state, {}, { reload });
        if (message) {
          promise.then(() => {
            CucCloudMessage[type](message, state);
          });
        }
        return promise;
      },
      goToDeleteBackup: /* @ngInject */ ($state) => (backupInstance) =>
        $state.go('enterprise-cloud-database.service.details.backups.delete', {
          backupInstance,
        }),
      goToManualBackup: /* @ngInject */ ($state) => () =>
        $state.go('enterprise-cloud-database.service.details.backups.manual'),
      goToRecovery: /* @ngInject */ ($state) => (minDate) =>
        $state.go(
          'enterprise-cloud-database.service.details.backups.recovery',
          { minDate },
        ),
      goToRestore: /* @ngInject */ ($state) => (backupInstance) =>
        $state.go('enterprise-cloud-database.service.details.backups.restore', {
          backupInstance,
        }),
      refreshBackups: /* @ngInject */ (
        $state,
        enterpriseCloudDatabaseService,
      ) => () => {
        enterpriseCloudDatabaseService.resetBackupsCache();
        return $state.reload();
      },
      restorePrice: /* @ngInject */ (catalog) => ({
        instance: get(
          find(catalog.addons, { planCode: 'restored-instance' }),
          'pricings[0]',
        ),
        volume: get(
          find(catalog.addons, { planCode: 'restored-volume' }),
          'pricings[0]',
        ),
      }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('enterprise_cloud_database_backup'),
    },
  });
};
