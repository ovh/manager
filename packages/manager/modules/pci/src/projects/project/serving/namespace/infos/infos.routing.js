export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.serving.namespace.infos', {
    url: '/infos',
    component: 'ovhManagerPciProjectServingNamespaceInfosComponent',
    resolve: {
      breadcrumb: () => false,
      registry: /* @ngInject */ (
        OvhManagerPciServingRegistryService,
        projectId,
        namespaceId,
      ) => OvhManagerPciServingRegistryService.get(projectId, namespaceId),
      goToNamespaceInfos: ($state, CucCloudMessage, projectId, namespaceId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.serving.namespace.infos',
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
              'pci.projects.project.serving.namespace.infos',
            ),
          );
        }

        return promise;
      },
      attachRegistry: /* @ngInject */ ($state, projectId, namespaceId) => () =>
        $state.go(
          'pci.projects.project.serving.namespace.infos.attach-registry',
          {
            projectId,
            namespaceId,
          },
        ),
      addModel: /* @ngInject */ ($state, projectId, namespaceId) => () =>
        $state.go('pci.projects.project.serving.namespace.models.add', {
          projectId,
          namespaceId,
        }),
      listModels: /* @ngInject */ ($state, projectId, namespaceId) => () =>
        $state.go('pci.projects.project.serving.namespace.models', {
          projectId,
          namespaceId,
        }),
      goToContainer: /* @ngInject */ ($state, projectId, namespace) => () =>
        $state.go('pci.projects.project.storages.objects.object', {
          projectId,
          containerId: namespace.containerId,
        }),
      deleteNamespace: /* @ngInject */ ($state, projectId, namespaceId) => () =>
        $state.go('pci.projects.project.serving.delete', {
          projectId,
          namespaceId,
        }),
      detachRegistry: /* @ngInject */ ($state, projectId, namespaceId) => () =>
        $state.go(
          'pci.projects.project.serving.namespace.infos.detach-registry',
          {
            projectId,
            namespaceId,
          },
        ),
    },
  });
};
