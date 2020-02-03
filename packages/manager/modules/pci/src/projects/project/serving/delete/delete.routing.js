export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.serving.delete', {
      url: '/delete?namespaceId',
      views: {
        modal: {
          component: 'ovhManagerPciServingDelete',
        },
      },
      layout: 'modal',
      params: {
        namespaceId: null,
      },
      resolve: {
        goBack: /* @ngInject */ (goToNamespace) => goToNamespace,
        namespaceId: /* @ngInject */ ($stateParams) => $stateParams.namespaceId,
        breadcrumb: () => null,
      },
    });
};
