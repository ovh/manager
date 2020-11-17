import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import some from 'lodash/some';

import Backup from '../../../components/dedicated-cloud/datacenter/backup/backup.class';

import {
  BACKUP_CONDITIONS_URL,
  BACKUP_GUIDES_URL,
  BACKUP_MINIMUM_HOST_COUNT,
} from '../../../components/dedicated-cloud/datacenter/backup/backup.constants';

import { BACKUP_TARIFF_URL } from './backup.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.datacenter.backup', {
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
              state: 'app.managedBaremetal.datacenter.backup.spla-licence',
            };
          }
          if (hosts.length < BACKUP_MINIMUM_HOST_COUNT) {
            return {
              state: 'app.managedBaremetal.datacenter.backup.minimum-hosts',
            };
          }
          if (backup.isInactive() || (backup.isLegacy() && backup.isActive())) {
            return { state: 'app.managedBaremetal.datacenter.backup.new' };
          }
          return false;
        }),
    resolve: {
      datacenterBackups: /* @ngInject */ (
        $q,
        datacenterList,
        dedicatedCloudDatacenterBackupService,
        productId,
        datacenterId,
      ) =>
        $q.all(
          map(
            filter(
              datacenterList,
              (datacenter) => datacenter.id !== parseInt(datacenterId, 10),
            ),
            (datacenter) =>
              dedicatedCloudDatacenterBackupService
                .getBackup(productId, datacenter.id)
                .then(
                  (backup) =>
                    new Backup({
                      ...backup,
                      datacenterId: datacenter.id,
                      datacenterName:
                        datacenter.description ||
                        datacenter.displayName ||
                        datacenter.id.toString(),
                    }),
                ),
          ),
        ),
      backupOffersUnderProcess: /* @ngInject */ (datacenterBackups) =>
        some(
          datacenterBackups,
          // If a backup is neither active nor inactive,
          // it may be in processing states like enabling, disabling etc
          (backup) => backup.isProcessing(),
        ),
      enabledBackupOffer: /* @ngInject */ (datacenterBackups) =>
        find(datacenterBackups, (backup) => backup.isActive()),
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
      backupConditionsUrl: /* @ngInject */ (currentUser) =>
        get(
          BACKUP_CONDITIONS_URL,
          currentUser.ovhSubsidiary,
          BACKUP_CONDITIONS_URL.FR,
        ),
      backupTariffUrl: /* @ngInject */ (currentUser) =>
        get(BACKUP_TARIFF_URL, currentUser.ovhSubsidiary, BACKUP_TARIFF_URL.FR),
      goToUpgradeOffer: /* @ngInject */ ($state, productId, datacenterId) => (
        actualOffer,
      ) =>
        $state.go('app.managedBaremetal.datacenter.backup.upgrade', {
          datacenterId,
          productId,
          actualOffer,
        }),
      goToNewBackup: /* @ngInject */ ($state, datacenterId, productId) => () =>
        $state.go('app.managedBaremetal.datacenter.backup.new', {
          datacenterId,
          productId,
        }),
      licence: /* @ngInject */ (currentService, DedicatedCloud, productId) =>
        DedicatedCloud.getDatacenterLicence(
          productId,
          currentService.usesLegacyOrder,
        ),
      licenceLink: /* @ngInject */ ($state, productId) =>
        $state.href('app.managedBaremetal.license', {
          productId,
        }),
      goToDeleteBackup: /* @ngInject */ (
        $state,
        datacenterId,
        productId,
      ) => () =>
        $state.go('app.managedBaremetal.datacenter.backup.delete', {
          datacenterId,
          productId,
        }),
      goToBackup: ($state, Alerter, datacenterId, productId) => (
        message = false,
        type = 'success',
      ) => {
        const promise = $state.go('app.managedBaremetal.datacenter.backup', {
          productId,
          datacenterId,
        });
        if (message) {
          return promise.then(() => {
            Alerter.set(
              `alert-${type}`,
              message,
              null,
              'app.managedBaremetal.datacenter.backup',
            );
          });
        }
        return promise;
      },
      guideUrl: /* @ngInject */ ($translate, coreConfig) =>
        get(
          BACKUP_GUIDES_URL,
          `${coreConfig.getRegion()}.${$translate.use()}`,
          get(BACKUP_GUIDES_URL, `${coreConfig.getRegion()}.default`),
        ),
      hosts: /* @ngInject */ (datacenterId, DedicatedCloud, productId) =>
        DedicatedCloud.getHosts(productId, datacenterId),
      operationsUrl: /* @ngInject */ ($state, datacenterId, productId) =>
        $state.href('app.managedBaremetal.operation', {
          datacenterId,
          productId,
        }),
      scrollToTop: /* @ngInject */ ($anchorScroll, $location) => () => {
        $location.hash('dedicatedCloud_datacenter_backup_header');
        $anchorScroll();
      },
    },
  });
};
