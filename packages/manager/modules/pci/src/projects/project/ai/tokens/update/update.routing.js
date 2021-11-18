export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai.tokens.update', {
    url: '/update?tokenId',
    views: {
      modal: {
        component: 'ovhManagerPciAiTokensUpdate',
      },
    },
    layout: 'modal',
    params: {
      tokenId: null,
    },
    resolve: {
      goBack: /* @ngInject */ (goToTokens) => goToTokens,
      tokenId: /* @ngInject */ ($stateParams) => $stateParams.tokenId,
      breadcrumb: () => null,
    },
  });
};
