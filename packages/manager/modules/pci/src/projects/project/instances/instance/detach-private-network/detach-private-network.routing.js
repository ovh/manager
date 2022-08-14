export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.instances.instance.detachPrivateNetwork',
    {
      url: '/network/private/detach',
      views: {
        modal: {
          component: 'pciInstancesInstanceDetachPrivateNetwork',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goToInstance) => {
          return goToInstance;
        },
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
