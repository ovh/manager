export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.serving.namespace.models.delete', {
      url: '/delete?modelId',
      views: {
        modal: {
          component: 'ovhManagerPciProjectServingNamespaceModelsDeleteComponent',
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
