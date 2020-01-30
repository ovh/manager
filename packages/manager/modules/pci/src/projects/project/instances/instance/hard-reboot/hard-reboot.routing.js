export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances.instance.hard-reboot', {
    url: '/hard-reboot',
    views: {
      modal: {
        component: 'pciInstancesInstanceReboot',
      },
    },
    layout: 'modal',
    translations: {
      value: ['../reboot'],
      format: 'json',
    },
    resolve: {
      rebootType: () => 'hard',
      goBack: /* @ngInject */ (goToInstance) => goToInstance,
      breadcrumb: () => null,
    },
  });
};
