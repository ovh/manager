export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'anthos.dashboard.general-information.order-public-ips',
    {
      url: '/order-public-ips',
      views: {
        modal: {
          component: 'anthosDashboardOrderPublicIPs',
        },
      },
      layout: 'modal',
      resolve: {
        breacrumb: () => false,
      },
    },
  );
};
