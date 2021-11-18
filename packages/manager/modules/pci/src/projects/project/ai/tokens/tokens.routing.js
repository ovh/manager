export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai.tokens', {
    url: '/tokens',
    params: {
      bearerToken: null,
    },
    component: 'ovhManagerPciAiTokens',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_ai_tokens_list_title'),

      bearerToken: /* @ngInject */ ($stateParams) => $stateParams.bearerToken,

      tokens: /* @ngInject */ (AiTokenService, projectId) =>
        AiTokenService.getTokens(projectId),

      addToken: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.ai.tokens.add', {
          projectId,
        }),

      deleteToken: /* @ngInject */ ($state, projectId) => (tokenId) =>
        $state.go('pci.projects.project.ai.tokens.delete', {
          projectId,
          tokenId,
        }),

      updateToken: /* @ngInject */ ($state, projectId) => (tokenId) =>
        $state.go('pci.projects.project.ai.tokens.update', {
          projectId,
          tokenId,
        }),

      goToTokens: ($state, CucCloudMessage, projectId) => (
        message = false,
        type = 'success',
        bearerToken,
      ) => {
        const reload = message && type === 'success';
        const promise = $state.go(
          'pci.projects.project.ai.tokens',
          {
            projectId,
            bearerToken,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            CucCloudMessage[type](message, 'pci.projects.project.ai.tokens'),
          );
        }

        return promise;
      },
    },
  });
};
