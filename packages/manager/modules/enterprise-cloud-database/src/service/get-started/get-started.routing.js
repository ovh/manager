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
      endPoints: /* @ngInject */ (clusterId, enterpriseCloudDatabaseService) =>
        enterpriseCloudDatabaseService.getEndpointsWithDetails(clusterId),
      hostList: /* @ngInject */ (clusterId, enterpriseCloudDatabaseService) =>
        enterpriseCloudDatabaseService.getHosts(clusterId),
      maintenanceWindow: /* @ngInject */ (
        clusterId,
        enterpriseCloudDatabaseService,
      ) => enterpriseCloudDatabaseService.getMaintenanceWindow(clusterId),
      regionInfo: /* @ngInject */ (
        clusterDetails,
        enterpriseCloudDatabaseService,
      ) =>
        enterpriseCloudDatabaseService.getRegionDetails(
          clusterDetails.regionName,
        ),
      securityGroups: /* @ngInject */ (
        clusterId,
        enterpriseCloudDatabaseService,
      ) => enterpriseCloudDatabaseService.getSecurityGroupList(clusterId),
    },
    url: '/get-started',
  });
};
