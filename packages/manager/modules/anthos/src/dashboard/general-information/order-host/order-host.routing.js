export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.general-information.order-host', {
    url: '/order-host',
    views: {
      modal: {
        component: 'anthosDashboardOrderHost',
      },
    },
    layout: 'modal',
    resolve: {
      breacrumb: () => false,
    },
  });
};
