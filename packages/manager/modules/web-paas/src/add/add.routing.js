export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.add', {
    url: '/new',
    component: 'webPaasAdd',
    params: {
      selectedProject: null,
    },
    resolve: {
      availablePlans: /* @ngInject */ (selectedProject, WebPaas) => {
        return selectedProject
          ? WebPaas.getUpgradeOffers(selectedProject.serviceId)
          : null;
      },
      catalog: /* @ngInject */ (
        WebPaas,
        user,
        availablePlans,
        selectedProject,
      ) =>
        WebPaas.getCatalog(user.ovhSubsidiary, availablePlans, selectedProject),
      selectedProject: /* @ngInject */ ($transition$) =>
        $transition$.params().selectedProject,
      plans: /* @ngInject */ (catalog) => catalog.plans,
      goBack: /* @ngInject */ (goToWebPaas) => goToWebPaas,
      getOrdersURL: /* @ngInject */ (coreURLBuilder) => (orderId) =>
        coreURLBuilder.buildURL('dedicated', '#/billing/orders', {
          status: 'all',
          orderId,
        }),
      breadcrumb: /* @ngInject */ ($translate, selectedProject) =>
        selectedProject
          ? $translate.instant('web_paas_add_project_title_edit')
          : $translate.instant('web_paas_add_project_title'),
    },
  });
};
