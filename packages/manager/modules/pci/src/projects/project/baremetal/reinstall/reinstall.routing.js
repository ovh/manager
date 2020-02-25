export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.baremetal.reinstall', {
    url: '/reinstall?instanceId',
    views: {
      modal: {
        component: 'pciInstancesInstanceReinstall',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
      goBack: /* @ngInject */ (goToInstances) => goToInstances,
      instance: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
        instanceId,
      ) => PciProjectsProjectInstanceService.get(projectId, instanceId),
      instanceId: /* @ngInject */ ($transition$) =>
        $transition$.params().instanceId,
      reinstallSuccessMessage: () =>
        'pci_projects_project_baremetal_instance_reinstall_success_message',
    },
  });
};
