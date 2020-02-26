import get from 'lodash/get';

import { BACKUP_TARIFF_URL } from './backup.constants';

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
        ])
        .then(([licence, backup]) => {
          if (!licence.isSplaActive) {
            return {
              state: 'app.dedicatedClouds.datacenter.backup.spla-licence',
            };
          }
          if (backup.isInactive() || backup.isLegacy()) {
            return { state: 'app.dedicatedClouds.datacenter.backup.new' };
          }
          return false;
        }),
    params: { messageToShow: null },
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
      messageToShow: /* @ngInject */ ($transition$) =>
        $transition$.params().messageToShow,
      goToUpgradeOffer: /* @ngInject */ (
        $state,
        productId,
        datacenterId,
      ) => () =>
        $state.go('app.dedicatedClouds.datacenter.backup.upgrade', {
          datacenterId,
          productId,
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
      goToBackup: ($state, Alerter, datacenterId, productId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        return $state.go(
          'app.dedicatedClouds.datacenter.backup',
          {
            productId,
            datacenterId,
            messageToShow: {
              type,
              message,
            },
          },
          {
            reload,
          },
        );
      },
      scrollToTop: () => () =>
        document
          .getElementById('dedicatedCloud_datacenter_backup_header')
          .scrollIntoView(),
    },
  });
};
