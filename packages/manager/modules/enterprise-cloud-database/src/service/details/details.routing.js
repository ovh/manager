export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('enterprise-cloud-database.service.details', {
    abstract: true,
    cache: false,
    component: 'enterpriseCloudDatabaseServiceDetailsComponent',
    resolve: {
      /* @ngInject */
      clusterUser: (clusterId, enterpriseCloudDatabaseService) =>
        enterpriseCloudDatabaseService.getUser(clusterId),
      /* @ngInject */
      securityGroups: (clusterId, enterpriseCloudDatabaseService) =>
        enterpriseCloudDatabaseService.getSecurityGroupList(clusterId),
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
    url: '/details',
  });
};
