export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.serving.namespace.tokens', {
    url: '/tokens',
    params: {
      jwtToken: null,
    },
    component: 'ovhManagerPciProjectServingNamespaceTokens',
    resolve: {
      jwtToken: /* @ngInject */ ($stateParams) => $stateParams.jwtToken,
      addToken: /* @ngInject */ ($state, projectId, namespaceId) => () =>
        $state.go('pci.projects.project.serving.namespace.tokens.add', {
          projectId,
          namespaceId,
        }),

      deleteToken: /* @ngInject */ ($state, projectId, namespaceId) => (
        tokenId,
      ) =>
        $state.go('pci.projects.project.serving.namespace.tokens.delete', {
          projectId,
          namespaceId,
          tokenId,
        }),

      updateToken: /* @ngInject */ ($state, projectId, namespaceId) => (
        tokenId,
      ) =>
        $state.go('pci.projects.project.serving.namespace.tokens.update', {
          projectId,
          namespaceId,
          tokenId,
        }),

      tokens: /* @ngInject */ (
        OvhManagerPciServingTokenService,
        projectId,
        namespaceId,
      ) => OvhManagerPciServingTokenService.getAll(projectId, namespaceId),
      goToNamespaceTokens: (
        $state,
        CucCloudMessage,
        projectId,
        namespaceId,
      ) => (message = false, type = 'success', jwtToken) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.serving.namespace.tokens',
          {
            projectId,
            namespaceId,
            jwtToken,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            CucCloudMessage[type](
              message,
              'pci.projects.project.serving.namespace.tokens',
            ),
          );
        }

        return promise;
      },

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_serving_namespace_tokens'),
    },
  });
};
