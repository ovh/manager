export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai.tokens.delete', {
    url: '/delete?tokenId',
    views: {
      modal: {
        component: 'ovhManagerPciAiTokensDelete',
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
