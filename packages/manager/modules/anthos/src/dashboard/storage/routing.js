export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.storage', {
    url: '/storage',
    views: {
      anthosTenantView: 'anthosStorage',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('anthos_dashboard_header_storage'),
      storageVolumes: /* @ngInject */ (
        $translate,
        AnthosTenantsService,
        serviceName,
      ) =>
        AnthosTenantsService.getStorageVolumes(serviceName).then((volumes) =>
          volumes.map((volume) => ({
            ...volume,
            sizeText: `${volume.size} ${$translate.instant(
              'anthos_dashboard_storage_unit_size_MB',
            )}`,
          })),
        ),
      storageUsage: /* @ngInject */ (AnthosTenantsService, serviceName) =>
        AnthosTenantsService.getTenantStorageUsage(serviceName).then(
          (usageData) => ({
            ...usageData,
            totalUsed: usageData.reservedSize + usageData.usedSize,
          }),
        ),
      goToStorage: /* @ngInject */ (goToState, serviceName) => (
        message,
        type,
      ) =>
        goToState('anthos.dashboard.storage', { serviceName }, message, type),
      goToAddStorage: /* @ngInject */ ($state, serviceName) => () =>
        $state.go('anthos.dashboard.storage.add', { serviceName }),
      goToRemoveStorage: /* @ngInject */ ($state, serviceName) => (storage) =>
        $state.go('anthos.dashboard.storage.remove', { serviceName, storage }),
    },
  });
};
