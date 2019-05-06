export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.instances.instance.unrescue', {
      url: '/rescue/end',
      views: {
        modal: {
          component: 'pciInstancesInstanceUnrescue',
        },
      },
      layout: 'modal',
      translations: {
        value: ['.'],
        format: 'json',
      },
      resolve: {
        goBack: /* @ngInject */ goToInstance => goToInstance,
      },
    });
};
