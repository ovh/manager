export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.serving.namespace.tokens.update', {
      url: '/update?tokenId',
      views: {
        modal: {
          component: 'ovhManagerPciProjectServingNamespaceTokensUpdate',
        },
      },
      layout: 'modal',
      params: {
        tokenId: null,
      },
      resolve: {
        goBack: /* @ngInject */ goToNamespaceTokens => goToNamespaceTokens,
        tokenId: /* @ngInject */ $stateParams => $stateParams.tokenId,
        breadcrumb: () => null,
      },
    });
};
