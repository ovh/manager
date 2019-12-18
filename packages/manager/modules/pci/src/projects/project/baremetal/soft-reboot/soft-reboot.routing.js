export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.baremetal.soft-reboot', {
    url: '/soft-reboot?instanceId',
    views: {
      modal: {
        component: 'pciInstancesInstanceReboot',
      },
    },
    layout: 'modal',
    resolve: {
      rebootType: () => 'soft',
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
