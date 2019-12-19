export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.instances.instance.soft-reboot', {
      url: '/soft-reboot',
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
        rebootType: () => 'soft',
        goBack: /* @ngInject */ (goToInstance) => goToInstance,
        breadcrumb: () => null,
      },
    });
};
