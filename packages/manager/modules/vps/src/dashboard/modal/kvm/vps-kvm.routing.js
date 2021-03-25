export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.kvm', {
    url: '/kvm',
    params: {
      noVnc: null,
    },
    views: {
      modal: {
        component: 'vpsDashboardKvm',
      },
    },
    layout: 'modal',
    resolve: {
      noVnc: /* @ngInject */ ($transition$) => $transition$.params().noVnc,
      breadcrumb: () => null,
    },
  });
};
