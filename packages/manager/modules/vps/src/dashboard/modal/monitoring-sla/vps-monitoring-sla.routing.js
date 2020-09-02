export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.monitoring-sla', {
    url: '/monitoring-sla',
    params: {
      state: {
        type: 'bool',
        value: false,
      },
      preview: {
        type: 'bool',
        value: false,
      },
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
      breadcrumb: () => null,
    },
  });
};
