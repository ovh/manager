export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('enterprise-cloud-database.service.details', {
    url: '/details',
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
  });
};
