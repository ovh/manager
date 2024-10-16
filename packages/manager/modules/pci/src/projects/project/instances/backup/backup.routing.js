export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances.backup', {
    url: '/backup?instanceId',
    views: {
      modal: {
        component: 'pciInstancesInstanceBackup',
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
        customerRegions,
      ) =>
        PciProjectsProjectInstanceService.get(
          projectId,
          instanceId,
          customerRegions,
        ),
      monthlyPrice: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
        instance,
      ) =>
        PciProjectsProjectInstanceService.getSnapshotMonthlyPrice(
          projectId,
          instance,
        ),
      goBack: /* @ngInject */ (goToInstances) => goToInstances,
      breadcrumb: () => null,
    },
  });
};
