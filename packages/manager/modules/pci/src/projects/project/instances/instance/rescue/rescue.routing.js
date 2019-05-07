export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.instances.instance.rescue', {
      url: '/rescue',
      views: {
        modal: {
          component: 'pciInstancesInstanceRescue',
        },
      },
      layout: 'modal',
      translations: {
        value: ['.'],
        format: 'json',
      },
      resolve: {
        images: /* @ngInject */ (
          PciProjectsProjectInstanceService,
          instance,
          projectId,
        ) => PciProjectsProjectInstanceService
          .getCompatibleRescueImages(projectId, instance),

        goBack: /* @ngInject */ goToInstance => goToInstance,
      },
    });
};
