export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.instances.instance.attachPrivateNetwork', {
      url: '/network/private/attach',
      views: {
        modal: {
          component: 'pciInstancesInstanceAttachPrivateNetwork',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goToInstance) => goToInstance,
        privateNetworks: /* @ngInject */ (
          PciProjectsProjectInstanceService,
          instance,
          projectId,
        ) => PciProjectsProjectInstanceService.getCompatiblesPrivateNetworks(projectId, instance),
        breadcrumb: () => null,
      },
    });
};
