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
        goBack: /* @ngInject */ ($rootScope, $state, projectId, instance) => () => $state.go('pci.projects.project.instances.instance', {
          projectId,
          instanceId: instance.id,
        }),
        volumes: /* @ngInject */ (
          PciProjectsProjectInstanceService,
          instance,
          projectId,
        ) => PciProjectsProjectInstanceService
          .getCompatiblesVolumes(projectId, instance),
      },
    });
};
