export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('enterprise-cloud-database.service.details.insights', {
    component: 'enterpriseCloudDatabaseServiceDetailsInsightsComponent',
    translations: {
      value: ['.'],
      format: 'json',
    },
    url: '/insights',
  });
};
