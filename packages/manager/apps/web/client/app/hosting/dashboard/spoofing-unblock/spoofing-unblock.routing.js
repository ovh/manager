export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.spoofing-unblock', {
    url: '/spoofing-unblock',
    layout: { name: 'modal', keyboard: true },
    views: {
      modal: {
        component: 'hostingSpoofingUnblockComponent',
      },
    },
    params: {
      path: null,
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('hosting_dashboard_spoofing_modal_title'),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
    },
  });
};
