export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('enterprise-cloud-database.service', {
    url: '/:clusterId',
    component: 'enterpriseCloudDatabaseServiceComponent',
    redirectTo: 'enterprise-cloud-database.service.details.overview',
    resolve: {
      clusterDetails: /* @ngInject */ (
        enterpriseCloudDatabaseService,
        clusterId,
      ) => {
        enterpriseCloudDatabaseService.resetClusterListCache();
        return enterpriseCloudDatabaseService.getClusterDetails(clusterId);
      },
      clusterId: /* @ngInject */ ($transition$) =>
        $transition$.params().clusterId,
      clusterType: /* @ngInject */ (clusterDetails) => clusterDetails.offerType,
      /* @ngInject */
      defaultPaymentMethod: (ovhPaymentMethod) =>
        ovhPaymentMethod.getDefaultPaymentMethod(),
      gotoClusterDetails: /* @ngInject */ ($state, clusterId) => (reload) =>
        $state.go(
          'enterprise-cloud-database.service.details.overview',
          { clusterId },
          { reload },
        ),
      breadcrumb: /* @ngInject */ (clusterId) => clusterId,
    },
  });
};
