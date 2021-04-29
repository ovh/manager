import find from 'lodash/find';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.dashboard.service.add-storage', {
    url: '/:projectId/add-storage',
    views: {
      modal: {
        component: 'webPaasProjectAddStorage',
      },
    },
    params: {
      projectId: null,
    },
    layout: 'modal',
    resolve: {
      projectId: /* @ngInject */ ($transition$) =>
        $transition$.params().projectId,
      selectedPlan: /* @ngInject */ (catalog, project) =>
        find(catalog.plans, { planCode: project.offer }),
      storageAddon: /* @ngInject */ (selectedPlan, WebPaas) =>
        WebPaas.getAddons(selectedPlan).then((result) => {
          return find(result, { family: 'storage' });
        }),
      goBack: /* @ngInject */ (goToProjectDetails) => goToProjectDetails,
      breadcrumb: () => null,
    },
  });
};
