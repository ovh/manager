import get from 'lodash/get';

import {
  BACKUP_TARIFF_URL,
  BACKUP_MINIMUM_HOST_COUNT,
} from './backup.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.backup', {
    url: '/backup',
    views: {
      pccDatacenterView: {
        component: 'dedicatedCloudDatacenterBackup',
      },
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .get('$q')
        .all([
          transition.injector().getAsync('licence'),
          transition.injector().getAsync('backup'),
          transition.injector().getAsync('hosts'),
        ])
        .then(([licence, backup, hosts]) => {
          if (!licence.isSplaActive) {
            return {
              state: 'app.dedicatedClouds.datacenter.backup.spla-licence',
            };
          }
          if (hosts.length < BACKUP_MINIMUM_HOST_COUNT) {
            return {
              state: 'app.dedicatedClouds.datacenter.backup.minimum-hosts',
            };
          }
          if (backup.isInactive() || backup.isLegacy()) {
            return { state: 'app.dedicatedClouds.datacenter.backup.new' };
          }
          return false;
        }),
    resolve: {
      productId: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      datacenterId: /* @ngInject */ ($transition$) =>
        $transition$.params().datacenterId,
      backup: /* @ngInject */ (
        dedicatedCloudDatacenterBackupService,
        productId,
        datacenterId,
      ) =>
        dedicatedCloudDatacenterBackupService.getBackup(
          productId,
          datacenterId,
        ),
      backupOffers: /* @ngInject */ (
        dedicatedCloudDatacenterBackupService,
        productId,
        datacenterId,
        currentUser,
      ) =>
        dedicatedCloudDatacenterBackupService.getBackupOffers(
          productId,
          datacenterId,
          currentUser.ovhSubsidiary,
        ),
      backupTariffUrl: /* @ngInject */ (currentUser) =>
        get(BACKUP_TARIFF_URL, currentUser.ovhSubsidiary, BACKUP_TARIFF_URL.FR),
      goToUpgradeOffer: /* @ngInject */ ($state, productId, datacenterId) => (
        actualOffer,
      ) =>
        $state.go('app.dedicatedClouds.datacenter.backup.upgrade', {
          datacenterId,
          productId,
          actualOffer,
        }),
      goToNewBackup: /* @ngInject */ ($state, datacenterId, productId) => () =>
        $state.go('app.dedicatedClouds.datacenter.backup.new', {
          datacenterId,
          productId,
        }),
      licence: /* @ngInject */ (currentService, DedicatedCloud, productId) =>
        DedicatedCloud.getDatacenterLicence(
          productId,
          currentService.usesLegacyOrder,
        ),
      licenceLink: /* @ngInject */ ($state, productId) =>
        $state.href('app.dedicatedClouds.license', {
          productId,
        }),
      goToDeleteBackup: /* @ngInject */ (
        $state,
        datacenterId,
        productId,
      ) => () =>
        $state.go('app.dedicatedClouds.datacenter.backup.delete', {
          datacenterId,
          productId,
        }),
      goToBackup: ($state, Alerter, datacenterId, productId) => (
        message = false,
        type = 'success',
      ) => {
        const promise = $state.go('app.dedicatedClouds.datacenter.backup', {
          productId,
          datacenterId,
        });
        if (message) {
          return promise.then(() => {
            Alerter.set(
              `alert-${type}`,
              message,
              null,
              'app.dedicatedClouds.datacenter.backup',
            );
          });
        }
        return promise;
      },
      hosts: /* @ngInject */ (datacenterId, DedicatedCloud, productId) =>
        DedicatedCloud.getHosts(productId, datacenterId),
      scrollToTop: () => () =>
        document
          .getElementById('dedicatedCloud_datacenter_backup_header')
          .scrollIntoView(),
    },
  });
};
