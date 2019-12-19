export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('enterprise-cloud-database.service', {
    abstract: true,
    component: 'enterpriseCloudDatabaseServiceComponent',
    resolve: {
      clusterDetails: /* @ngInject */ (enterpriseCloudDatabaseService, clusterId) => {
        enterpriseCloudDatabaseService.resetClusterListCache();
        return enterpriseCloudDatabaseService.getClusterDetails(clusterId);
      },
      clusterId: /* @ngInject */ ($transition$) => $transition$.params().clusterId,
      clusterType: /* @ngInject */ (clusterDetails) => clusterDetails.offerType,
      defaultPaymentMethod: /* @ngInject */
        (ovhPaymentMethod) => ovhPaymentMethod.getDefaultPaymentMethod(),
      gotoClusterDetails: /* @ngInject */ ($state, clusterId) => (reload) => $state.go('enterprise-cloud-database.service.details.overview', { clusterId }, { reload }),
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
    url: '/service/:clusterId',
  });
};
