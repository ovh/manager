export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.add-datacenter.upgrade-range',
    {
      url: '/upgrade-range/:range?upgradeCode',
      params: {
        upgradeCode: null,
      },
      views: {
        'dedicatedCloudView@app.dedicatedCloud.details':
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
              const managementFeePlan = data.find(
                (option) => option.resource.name === managementServicename,
              );
              return managementFeePlan?.serviceId;
            }),
        backButtonText: /* @ngInject */ ($translate) =>
          $translate.instant('dedicated_cloud_upgrade_range'),
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('dedicated_cloud_upgrade_range'),
      },
    },
  );
};
