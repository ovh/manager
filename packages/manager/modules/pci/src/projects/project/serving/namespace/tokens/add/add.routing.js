export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.serving.namespace.tokens.add', {
      url: '/add?resource',
      params: {
        resource: null,
      },
      views: {
        modal: {
          component: 'ovhManagerPciProjectServingNamespaceTokensAddComponent',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ goToNamespaceTokens => goToNamespaceTokens,
        resource: /* @ngInject */ $stateParams => $stateParams.resource,
        breadcrumb: () => null,
      },
    });
};
