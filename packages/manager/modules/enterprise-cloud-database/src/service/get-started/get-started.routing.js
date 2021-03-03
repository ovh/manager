export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('enterprise-cloud-database.service.get-started', {
    url: '/get-started',
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
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'enterprise_cloud_database_service_get_started_title',
        ),
    },
  });
};
