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
    },
  });
};
