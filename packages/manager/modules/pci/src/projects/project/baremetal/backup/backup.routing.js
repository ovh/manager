export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.baremetal.backup', {
    url: '/backup?instanceId',
    views: {
      modal: {
        component: 'pciInstancesBaremetalBackup',
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
      priceEstimation: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
        instance,
      ) =>
        PciProjectsProjectInstanceService.getBackupPriceEstimation(
          projectId,
          instance,
        ),
      goBack: /* @ngInject */ (goToInstances) => goToInstances,
      breadcrumb: () => null,
    },
  });
};
