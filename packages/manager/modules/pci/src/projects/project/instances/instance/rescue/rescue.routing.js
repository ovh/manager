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
      resolve: {
        images: /* @ngInject */ (
          PciProjectsProjectInstanceService,
          instance,
          projectId,
        ) => PciProjectsProjectInstanceService
          .getCompatibleRescueImages(projectId, instance),

        goBack: /* @ngInject */ ($state, projectId, instanceId) => () => $state.go('pci.projects.project.instances.instance', {
          projectId,
          instanceId,
        }),
      },
    });
};
