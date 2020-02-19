export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.monitoring-sla', {
    url: '/monitoring-sla',
    params: {
      state: null,
      preview: null,
    },
    views: {
      modal: {
        component: 'vpsDashboardMonitoringSla',
      },
    },
    layout: 'modal',
    resolve: {
      state: /* @ngInject */ ($transition$) => $transition$.params().state,
      preview: /* @ngInject */ ($transition$) => $transition$.params().preview,
    },
  });
};
