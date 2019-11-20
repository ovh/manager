export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.serving.namespace.tokens.delete', {
      url: '/delete?tokenId',
      views: {
        modal: {
          component: 'ovhManagerPciProjectServingNamespaceTokensDeleteComponent',
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
