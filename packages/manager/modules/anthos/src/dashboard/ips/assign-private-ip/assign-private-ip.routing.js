export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.ips.assign-private-ip', {
    url: '/assign-private-ip',
    views: {
      modal: {
        component: 'anthosDashboardIpsAssignPrivateIp',
      },
    },
    layout: 'modal',
    resolve: {
      breacrumb: () => false,
    },
  });
};
