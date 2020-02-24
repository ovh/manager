import get from 'lodash/get';

import { BACKUP_STATE_DISABLED, BACKUP_OFFER_LEGACY } from './backup.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.backup', {
    url: '/backup',
    views: {
      pccDatacenterView: {
        component: 'ovhManagerDedicatedCloudBackup',
      },
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('backup')
        .then((backup) => {
          if (get(backup, 'state', null) === BACKUP_STATE_DISABLED) {
            return { state: 'app.dedicatedClouds.datacenter.backup.new' };
          }
          if (get(backup, 'backupOffer', null) === BACKUP_OFFER_LEGACY) {
            return { state: 'app.dedicatedClouds.datacenter.backup.legacy' };
          }
          return false;
        }),
    resolve: {
      productId: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      datacenterId: /* @ngInject */ ($transition$) =>
        $transition$.params().datacenterId,
      backup: /* @ngInject */ (
        datacenterBackupService,
        productId,
        datacenterId,
      ) => datacenterBackupService.getBackup(productId, datacenterId),
      goToNewBackup: /* @ngInject */ ($state, datacenterId, productId) => () =>
        $state.go('app.dedicatedClouds.datacenter.backup.new', {
          datacenterId,
          productId,
        }),
      goToBackup: ($state, Alerter, datacenterId, productId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const promise = $state.go(
          'app.dedicatedClouds.datacenter.backup',
          {
            productId,
            datacenterId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            Alerter.set(
              `alert-${type}`,
              message,
              'app.dedicatedClouds.datacenter.backup',
            ),
          );
        }
        return promise;
      },
    },
  });
};
