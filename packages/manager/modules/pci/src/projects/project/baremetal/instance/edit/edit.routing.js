export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.baremetal.instance.edit', {
    url: '/edit',
    views: {
      '@pci.projects.project.baremetal': {
        component: 'pciProjectsProjectInstancesInstanceEdit',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'pci_projects_project_instances_instance_edit_title',
        ),
      goBack: /* @ngInject */ (goToInstance) => goToInstance,
      instanceId: /* @ngInject */ ($transition$) =>
        $transition$.params().instanceId,
      imageEditMessage: () =>
        'pci_projects_project_baremetal_instance_edit_reboot_message',
      imageEditSuccessMessage: () =>
        'pci_projects_project_baremetal_instance_edit_image_success_message',
    },
  });
};
