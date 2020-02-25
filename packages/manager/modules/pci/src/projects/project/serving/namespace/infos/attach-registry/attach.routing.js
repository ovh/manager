export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.serving.namespace.infos.attach-registry',
    {
      url: '/attach-registry',
      views: {
        modal: {
          component:
            'ovhManagerPciProjectServingNamespaceInfosAttachRegistryComponent',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goToNamespaceInfos) => goToNamespaceInfos,
        breadcrumb: () => null,
      },
    },
  );
};
