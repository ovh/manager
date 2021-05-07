export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.add', {
    url: '/new',
    component: 'webPaasAdd',
    resolve: {
      catalog: /* @ngInject */ (WebPaas, user) =>
        WebPaas.getCatalog(user.ovhSubsidiary),
      plans: /* @ngInject */ (catalog) => catalog.plans,
      goBack: /* @ngInject */ (goToWebPaas) => goToWebPaas,
      getOrdersURL: /* @ngInject */ (coreURLBuilder) => (orderId) =>
        coreURLBuilder.buildURL('dedicated', '#/billing/orders', {
          status: 'all',
          orderId,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('web_paas_add_project_title'),
    },
  });
};
