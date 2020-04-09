export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard.agora-order', {
    url: '/agoraOrder',
    redirectTo: 'app.ip.dashboard.order',
  });

  $stateProvider.state('app.ip.dashboard.order', {
    url: '/order?serviceNameToOrder',
    params: {
      serviceNameToOrder: {
        type: 'string',
      },
    },
    resolve: {
      goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
      serviceNameToOrder: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceNameToOrder,
    },
    views: {
      modal: {
        component: 'ipDashboardOrder',
      },
    },
    layout: 'modal',
  });
};
