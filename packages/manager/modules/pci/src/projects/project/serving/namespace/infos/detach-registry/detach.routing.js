export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.serving.namespace.infos.detach-registry', {
      url: '/detach-registry',
      views: {
        modal: {
          component: 'ovhManagerPciProjectServingNamespaceInfosDetachRegistry',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ goToNamespaceInfos => goToNamespaceInfos,
        breadcrumb: () => null,
      },
    });
};
