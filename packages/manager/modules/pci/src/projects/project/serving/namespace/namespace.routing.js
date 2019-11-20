export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.serving.namespace', {
      url: '/:namespaceId',
      component: 'pciProjectServingNamespace',

      resolve: {
        breadcrumb: /* @ngInject */ namespace => namespace.description,
        namespaceId: /* @ngInject */ $transition$ => $transition$.params().namespaceId,
        namespace: /* @ngInject */ (
          PciProjectServingService,
          projectId,
          namespaceId,
        ) => PciProjectServingService.get(projectId, namespaceId),
        deleteNamespace: /* @ngInject */ ($state, projectId, namespaceId) => () => $state.go('pci.projects.project.serving.namespace.delete', {
          projectId,
          namespaceId,
        }),
        namespaceLink: /* @ngInject */ ($state, projectId, namespace) => $state.href('pci.projects.project.serving.namespace', {
          projectId,
          namespaceId: namespace.id,
        }),
        currentActiveLink: /* @ngInject */ ($transition$, $state) => () => $state
          .href($state.current.name, $transition$.params()),
        infosLink: /* @ngInject */ (
          $state,
          projectId,
          namespaceId,
        ) => $state.href('pci.projects.project.serving.namespace.infos', {
          projectId,
          namespaceId,
        }),
        modelsLink: /* @ngInject */ (
          $state,
          projectId,
          namespaceId,
        ) => $state.href('pci.projects.project.serving.namespace.models', {
          projectId,
          namespaceId,
        }),
        tokensLink: /* @ngInject */ (
          $state,
          projectId,
          namespaceId,
        ) => $state.href('pci.projects.project.serving.namespace.tokens', {
          projectId,
          namespaceId,
        }),
      },
      redirectTo: 'pci.projects.project.serving.namespace.infos',
    });
};
