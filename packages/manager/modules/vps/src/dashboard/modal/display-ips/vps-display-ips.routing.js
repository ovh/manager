export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.display-ips', {
    url: '/display-ips',
    views: {
      modal: {
        component: 'vpsDashboardDisplayIps',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
