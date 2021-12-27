export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.host.order', {
    url: '/order',
    views: {
      'anthosTenantView@anthos.dashboard': 'anthosDashboardHostOrder',
    },
    resolve: {
      breadcrumb: () => null,
    },
  });
};
