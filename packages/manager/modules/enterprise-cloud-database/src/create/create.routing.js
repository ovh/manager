import map from 'lodash/map';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('enterprise-cloud-database.create', {
    component: 'enterpriseCloudDatabaseCreateComponent',
    url: '/create',
    translations: {
      value: ['.'],
      format: 'json',
    },
    resolve: {
      /* @ngInject */
      hasDefaultPaymentMethod: (ovhPaymentMethod) =>
        ovhPaymentMethod.hasDefaultPaymentMethod(),
      /* @ngInject */
      defaultPaymentMethod: (ovhPaymentMethod) =>
        ovhPaymentMethod.getDefaultPaymentMethod(),
      regions: /* @ngInject */ (
        $q,
        capabilities,
        enterpriseCloudDatabaseService,
      ) =>
        $q.all(
          map(capabilities, (offer) =>
            enterpriseCloudDatabaseService.getRegions(offer.name),
          ),
        ),
      hostCount: /* @ngInject */ (enterpriseCloudDatabaseService, regions) =>
        enterpriseCloudDatabaseService.getAllHostCount(regions),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('enterprise_cloud_database_create_title'),
    },
  });
};
