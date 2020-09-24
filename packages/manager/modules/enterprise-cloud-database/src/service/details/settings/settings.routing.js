export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('enterprise-cloud-database.service.details.settings', {
    url: '/settings',
    cache: false,
    component: 'enterpriseCloudDatabaseServiceDetailsSettingsComponent',
    params: {
      securityGroupId: null,
    },
    resolve: {
      addRule: /* @ngInject */ ($state, clusterId) => (securityGroup) =>
        $state.go(
          'enterprise-cloud-database.service.details.settings.add-rule',
          { clusterId, securityGroup },
        ),
      createSecurityGroup: /* @ngInject */ ($state, clusterId) => () =>
        $state.go(
          'enterprise-cloud-database.service.details.settings.create-security-group',
          { clusterId },
        ),
      deleteRule: /* @ngInject */ ($state, clusterId) => (
        securityGroup,
        rule,
      ) =>
        $state.go(
          'enterprise-cloud-database.service.details.settings.delete-rule',
          { clusterId, securityGroup, rule },
        ),
      deleteSecurityGroup: /* @ngInject */ ($state, clusterId) => (
        securityGroup,
      ) =>
        $state.go(
          'enterprise-cloud-database.service.details.settings.delete-security-group',
          { clusterId, securityGroup },
        ),
      editSecurityGroup: /* @ngInject */ ($state, clusterId) => (
        securityGroup,
      ) =>
        $state.go(
          'enterprise-cloud-database.service.details.settings.edit-security-group',
          { clusterId, securityGroup },
        ),
      /* @ngInject */
      maintenanceWindow: (clusterId, enterpriseCloudDatabaseService) =>
        enterpriseCloudDatabaseService.getMaintenanceWindow(clusterId),
      /* @ngInject */
      regionInfo: (clusterDetails, enterpriseCloudDatabaseService) =>
        enterpriseCloudDatabaseService.getRegionDetails(
          clusterDetails.regionName,
        ),
      reload: /* @ngInject */ ($state) => () => $state.reload(),
      securityGroupId: /* @ngInject */ ($transition$) =>
        $transition$.params().securityGroupId,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'enterprise_cloud_database_service_details_settings',
        ),
    },
  });
};
