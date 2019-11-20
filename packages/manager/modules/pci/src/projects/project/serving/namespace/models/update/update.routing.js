export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.serving.namespace.models.update', {
      url: '/update?modelId',
      views: {
        modal: {
          component: 'ovhManagerPciProjectServingNamespaceModelsUpdateComponent',
        },
      },
      layout: 'modal',
      params: {
        modelId: null,
      },
      resolve: {
        goBack: /* @ngInject */ goToNamespaceModels => goToNamespaceModels,
        modelId: /* @ngInject */ $stateParams => $stateParams.modelId,
        breadcrumb: () => null,
      },
    });
};
