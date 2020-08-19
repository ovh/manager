export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.serving.namespace.models.details',
    {
      url: '/details/:modelId',
      views: {
        'content@pci.projects.project.serving.namespace':
          'ovhManagerPciProjectServingNamespaceModelsDetailsComponent',
      },
      resolve: {
        goBack: /* @ngInject */ (goToNamespaceModels) => goToNamespaceModels,
        breadcrumb: /* @ngInject */ ($stateParams) => $stateParams.modelId,

        deleteModel: /* @ngInject */ ($state, projectId, namespaceId) => (
          modelId,
        ) =>
          $state.go('pci.projects.project.serving.namespace.models.delete', {
            projectId,
            namespaceId,
            modelId,
          }),

        updateModel: /* @ngInject */ ($state, projectId, namespaceId) => (
          modelId,
        ) =>
          $state.go('pci.projects.project.serving.namespace.models.update', {
            projectId,
            namespaceId,
            modelId,
          }),

        metricsToken: /* @ngInject */ (
          OvhManagerPciServingModelsService,
          projectId,
          namespaceId,
        ) => {
          return OvhManagerPciServingModelsService.getMetricsToken(
            projectId,
            namespaceId,
          );
        },
        model: /* @ngInject */ (
          OvhManagerPciServingModelsService,
          projectId,
          namespaceId,
          $stateParams,
        ) =>
          OvhManagerPciServingModelsService.get(
            projectId,
            namespaceId,
            $stateParams.modelId,
          ),
      },
    },
  );
};
