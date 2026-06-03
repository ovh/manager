export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.renew-period', {
    url: '/renew-period',
    layout: { name: 'modal', keyboard: true },
    views: {
      modal: {
        component: 'hostingRenewPeriodComponent',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('hosting_renew_period_title'),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      serviceId: /* @ngInject */ (HostingRenewPeriodService, serviceName) =>
        HostingRenewPeriodService.getServiceId(serviceName),
    },
  });
};
