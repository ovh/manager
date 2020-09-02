export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.reboot', {
    url: '/reboot',
    views: {
      modal: {
        component: 'vpsDashboardReboot',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
