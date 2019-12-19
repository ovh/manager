export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.instances.instance.attachVolume', {
      url: '/attach?storageId',
      views: {
        modal: {
          component: 'pciInstancesInstanceAttachVolume',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goToInstance) => goToInstance,
        volumes: /* @ngInject */ (
          PciProjectsProjectInstanceService,
          instance,
          projectId,
        ) => PciProjectsProjectInstanceService
          .getCompatiblesVolumes(projectId, instance),
        breadcrumb: () => null,
      },
    });
};
