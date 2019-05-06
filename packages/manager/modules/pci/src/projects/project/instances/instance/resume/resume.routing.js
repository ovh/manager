export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.instances.instance.resume', {
      url: '/resume',
      views: {
        modal: {
          component: 'pciInstancesInstanceResume',
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
