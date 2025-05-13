export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.add-datacenter.upgrade-range',
    {
      url: '/upgrade-range/:range?upgradeCode',
      params: {
        upgradeCode: null,
      },
      views: {
        'dedicatedCloudView@app.managedBaremetal.details':
          'dedicatedCloudUpgradeRange',
      },
      resolve: {
        range: /* @ngInject */ ($transition$) => $transition$.params().range,
        upgradeCode: /* @ngInject */ ($transition$) => {
          return $transition$.params().upgradeCode;
        },
        managementFeeServiceId: /* @ngInject */ (
          $http,
          dedicatedCloud,
          productId,
        ) =>
          $http
            .get(`/services/${dedicatedCloud.serviceInfos.serviceId}/options`)
            .then(({ data }) => {
              const managementServicename = `${productId}/managementfee`;
              const managementFeeOption = data.find(
                (option) => option.resource.name === managementServicename,
              );
              return managementFeeOption?.serviceId;
            }),
        backButtonText: /* @ngInject */ ($translate) =>
          $translate.instant('managed_baremetal_upgrade_range'),
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('managed_baremetal_upgrade_range'),
      },
    },
  );
};
