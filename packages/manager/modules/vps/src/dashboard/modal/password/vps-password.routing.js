export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.reboot-rescue', {
    url: '/reboot-rescue',
    views: {
      modal: {
        component: 'vpsDashboardRebootRescue',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
