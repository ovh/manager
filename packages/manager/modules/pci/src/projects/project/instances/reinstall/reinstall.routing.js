export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances.reinstall', {
    url: '/reinstall?instanceId',
    views: {
      modal: {
        component: 'pciInstancesInstanceReinstall',
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
