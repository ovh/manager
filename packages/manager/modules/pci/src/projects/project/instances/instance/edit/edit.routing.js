export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances.instance.edit', {
    url: '/edit',
    views: {
      '@pci.projects.project.instances': {
        component: 'pciProjectsProjectInstancesInstanceEdit',
      },
    },
    resolve: {
      instanceId: /* @ngInject */ ($transition$) =>
        $transition$.params().instanceId,
      instance: /* @ngInject */ (
        PciProjectsProjectInstanceService,
        projectId,
        instanceId,
      ) => PciProjectsProjectInstanceService.get(projectId, instanceId),
      goBack: /* @ngInject */ (goToInstance) => goToInstance,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'pci_projects_project_instances_instance_edit_title',
        ),
    },
  });
};
