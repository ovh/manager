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
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'pci_projects_project_serving_namespace_models_details',
          ),

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
