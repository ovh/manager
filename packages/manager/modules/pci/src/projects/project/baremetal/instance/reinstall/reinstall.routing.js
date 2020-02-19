export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.baremetal.instance.reinstall', {
    url: '/reinstall',
    views: {
      modal: {
        component: 'pciInstancesInstanceReinstall',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
      goBack: /* @ngInject */ (goToInstance) => goToInstance,
      reinstallSuccessMessage: () =>
        'pci_projects_project_baremetal_instance_reinstall_success_message',
    },
  });
};
