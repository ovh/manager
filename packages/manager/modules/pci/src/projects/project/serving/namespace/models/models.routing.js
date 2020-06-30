export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.serving.namespace.models', {
    url: '/models',
    component: 'ovhManagerPciProjectServingNamespaceModelsComponent',
    resolve: {
      addModel: /* @ngInject */ ($state, projectId, namespaceId) => () =>
        $state.go('pci.projects.project.serving.namespace.models.add', {
          projectId,
          namespaceId,
        }),

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

      generateToken: /* @ngInject */ ($state, projectId, namespaceId) => (
        modelId,
      ) =>
        $state.go('pci.projects.project.serving.namespace.tokens.add', {
          projectId,
          namespaceId,
          modelId,
          resource: modelId,
        }),

      details: /* @ngInject */ ($state, projectId, namespaceId) => (modelId) =>
        $state.go('pci.projects.project.serving.namespace.models.details', {
          projectId,
          namespaceId,
          modelId,
        }),

      modelLink: /* @ngInject */ ($state, projectId, namespaceId) => ({ id }) =>
        $state.href('pci.projects.project.serving.namespace.models.details', {
          projectId,
          namespaceId,
          modelId: id,
        }),

      models: /* @ngInject */ (
        OvhManagerPciServingModelsService,
        projectId,
        namespaceId,
      ) => OvhManagerPciServingModelsService.getAll(projectId, namespaceId),
      goToNamespaceModels: (
        $state,
        CucCloudMessage,
        projectId,
        namespaceId,
      ) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.serving.namespace.models',
          {
            projectId,
            namespaceId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            CucCloudMessage[type](
              message,
              'pci.projects.project.serving.namespace.models',
            ),
          );
        }

        return promise;
      },

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_serving_namespace_models'),
    },
  });
};
