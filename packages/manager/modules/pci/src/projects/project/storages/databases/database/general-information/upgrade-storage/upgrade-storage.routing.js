import {
  DISK_USAGE_MARGIN,
  DISK_USAGE_METRICS,
  DISK_USAGE_METRICS_PERIOD,
} from './upgrade-storage.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.general-information.upgrade-storage',
    {
      url: '/upgrade-storage',
      component: 'ovhManagerPciProjectDatabaseGeneralInformationUpgradeStorage',
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'pci_databases_general_information_upgrade_storage',
          ),
        flavor: /* @ngInject */ (getCurrentFlavor) => getCurrentFlavor(),
        onStorageUpgrade: /* @ngInject */ (goBackAndPoll) => goBackAndPoll,
        minStorageLimit: /* @ngInject */ (
          DatabaseService,
          projectId,
          database,
          flavor,
        ) =>
          DatabaseService.getMetrics(
            projectId,
            database.engine,
            database.id,
            DISK_USAGE_METRICS,
            DISK_USAGE_METRICS_PERIOD,
          ).then((data) => {
            const usedDiskPercent = Math.max(
              ...data.metrics.map((metric) => metric.dataPoints[0].value),
            );
            let lowValue = 0;
            if (usedDiskPercent > 0) {
              const usedGb =
                (database.storage.size.value * usedDiskPercent) / 100;
              const withMargin = usedGb * DISK_USAGE_MARGIN;
              const minAdditionalGb = withMargin - flavor.minDiskSize;
              const nbStep = Math.ceil(minAdditionalGb / flavor.stepDiskSize);
              lowValue = flavor.stepDiskSize * nbStep;
            }
            return lowValue;
          }),
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
