export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.baremetal.instance.detachPrivateNetwork',
    {
      url: '/network/private/detach',
      views: {
        modal: {
          component: 'pciInstancesInstanceDetachPrivateNetwork',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goToInstance) => goToInstance,
        privateNetworks: /* @ngInject */ (
          PciProjectsProjectInstanceService,
          instance,
          projectId,
        ) =>
          PciProjectsProjectInstanceService.getCompatiblesPrivateNetworks(
            projectId,
            instance,
          ),
        breadcrumb: () => null,
      },
    },
  );
};
