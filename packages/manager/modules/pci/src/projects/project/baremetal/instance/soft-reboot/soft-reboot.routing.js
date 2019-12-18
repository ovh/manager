export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.baremetal.instance.soft-reboot', {
    url: '/soft-reboot',
    views: {
      modal: {
        component: 'pciInstancesInstanceReboot',
      },
    },
    layout: 'modal',
    resolve: {
      rebootType: () => 'soft',
      goBack: /* @ngInject */ (goToInstance) => goToInstance,
      breadcrumb: () => null,
    },
  });
};
