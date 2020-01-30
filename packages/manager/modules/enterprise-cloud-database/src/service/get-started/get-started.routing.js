export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('enterprise-cloud-database.service.get-started', {
    component: 'enterpriseCloudDatabaseServiceGetStartedComponent',
    params: {
      data: null,
    },
    resolve: {
      addReplicas: /* @ngInject */ ($state, clusterId, hostList) => (
        callback,
      ) =>
        $state.go(
          'enterprise-cloud-database.service.get-started.add-replicas',
          { callback, clusterId, hostList },
        ),
      /* @ngInject */
      endPoints: (clusterId, enterpriseCloudDatabaseService) =>
        enterpriseCloudDatabaseService.getEndpointsWithDetails(clusterId),
      /* @ngInject */
      hostList: (clusterId, enterpriseCloudDatabaseService) =>
        enterpriseCloudDatabaseService.getHosts(clusterId),
      /* @ngInject */
      maintenanceWindow: (clusterId, enterpriseCloudDatabaseService) =>
        enterpriseCloudDatabaseService.getMaintenanceWindow(clusterId),
      /* @ngInject */
      regionInfo: (clusterDetails, enterpriseCloudDatabaseService) =>
        enterpriseCloudDatabaseService.getRegionDetails(
          clusterDetails.regionName,
        ),
      /* @ngInject */
      securityGroups: (clusterId, enterpriseCloudDatabaseService) =>
        enterpriseCloudDatabaseService.getSecurityGroupList(clusterId),
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
    url: '/get-started',
  });
};
