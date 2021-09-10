export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.general-information.order-host', {
    url: '/order-host',
    views: {
      modal: {
        component: 'anthosOrderHost',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,

      orderHostHitTracking: () => {
        return 'order-host';
      },
    },
  });
};
