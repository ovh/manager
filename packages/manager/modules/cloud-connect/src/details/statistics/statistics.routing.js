export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.statistics', {
    url: '/statistics',
    component: 'cloudConnectDetailsStatistics',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('cloud_connect_statistics'),
    },
  });
};
