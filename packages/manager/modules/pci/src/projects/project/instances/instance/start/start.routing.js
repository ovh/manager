export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances.instance.start', {
    url: '/start',
    views: {
      modal: {
        component: 'pciInstancesInstanceStart',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToInstance) => goToInstance,
      breadcrumb: () => null,
    },
  });
};
