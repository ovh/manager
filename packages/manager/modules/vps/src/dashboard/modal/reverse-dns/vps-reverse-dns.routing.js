export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.reverse-dns', {
    url: '/reverse-dns',
    views: {
      modal: {
        component: 'vpsDashboardReverseDns',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
