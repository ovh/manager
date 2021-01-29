export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances.instance.unshelve', {
    url: '/unshelve',
    views: {
      modal: {
        component: 'pciInstancesInstanceUnshelve',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToInstance) => goToInstance,
      breadcrumb: () => null,
    },
  });
};
