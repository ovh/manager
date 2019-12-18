export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.baremetal.instance.rescue', {
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
      ) =>
        PciProjectsProjectInstanceService.getCompatibleRescueImages(
          projectId,
          instance,
        ),

      goBack: /* @ngInject */ (goToInstance) => goToInstance,
      breadcrumb: () => null,
    },
  });
};
