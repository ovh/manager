export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.baremetal.instance.hard-reboot', {
    url: '/hard-reboot',
    views: {
      modal: {
        component: 'pciInstancesInstanceReboot',
      },
    },
    layout: 'modal',
    resolve: {
      rebootType: () => 'hard',
      goBack: /* @ngInject */ (goToInstance) => goToInstance,
      breadcrumb: () => null,
    },
  });
};
