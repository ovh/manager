export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances.instance.backup', {
    url: '/backup',
    views: {
      modal: {
        component: 'pciInstancesInstanceBackup',
      },
    },
    layout: 'modal',
    resolve: {
      priceEstimation: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
        instance,
      ) =>
        PciProjectsProjectInstanceService.getBackupPriceEstimation(
          projectId,
          instance,
        ),
      goBack: /* @ngInject */ (goToInstance) => goToInstance,
      breadcrumb: () => null,
    },
  });
};
