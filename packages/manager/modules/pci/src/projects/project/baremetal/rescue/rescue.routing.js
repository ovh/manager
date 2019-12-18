export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.baremetal.rescue', {
    url: '/rescue/start?instanceId',
    views: {
      modal: {
        component: 'pciInstancesInstanceRescue',
      },
    },
    layout: 'modal',
    resolve: {
      instanceId: /* @ngInject */ ($transition$) =>
        $transition$.params().instanceId,
      instance: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
        instanceId,
      ) => PciProjectsProjectInstanceService.get(projectId, instanceId),

      images: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        instance,
        projectId,
      ) =>
        PciProjectsProjectInstanceService.getCompatibleRescueImages(
          projectId,
          instance,
        ),

      goBack: /* @ngInject */ (goToInstances) => goToInstances,
      breadcrumb: () => null,
    },
  });
};
