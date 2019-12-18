export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.baremetal.hard-reboot', {
    url: '/hard-reboot?instanceId',
    views: {
      modal: {
        component: 'pciInstancesInstanceReboot',
      },
    },
    layout: 'modal',
    resolve: {
      rebootType: () => 'hard',
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
