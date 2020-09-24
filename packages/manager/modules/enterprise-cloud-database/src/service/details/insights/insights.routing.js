export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('enterprise-cloud-database.service.details.insights', {
    url: '/insights',
    component: 'enterpriseCloudDatabaseServiceDetailsInsightsComponent',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('enterprise_cloud_database_insights'),
    },
  });
};
