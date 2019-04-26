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
        goBack: /* @ngInject */ ($rootScope, $state, projectId, instance) => () => $state.go('pci.projects.project.instances.instance', {
          projectId,
          instanceId: instance.id,
        }),
        privateNetworks: /* @ngInject */ (
          PciProjectsProjectInstanceService,
          instance,
          projectId,
        ) => PciProjectsProjectInstanceService.getCompatiblesPrivateNetworks(projectId, instance),
      },
    });
};
