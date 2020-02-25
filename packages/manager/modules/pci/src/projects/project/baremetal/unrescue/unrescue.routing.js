export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.baremetal.unrescue', {
    url: '/rescue/end?instanceId',
    views: {
      modal: {
        component: 'pciInstancesInstanceUnrescue',
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

      goBack: /* @ngInject */ (goToInstances) => goToInstances,
      breadcrumb: () => null,
    },
  });
};
