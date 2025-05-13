export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.reinstall', {
    url: '/reinstall',
    views: {
      modal: {
        component: 'vpsDashboardReinstall',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
