export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.baremetal.instance.delete', {
    url: '/delete',
    views: {
      modal: {
        component: 'pciInstancesInstanceDelete',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToInstances, goToInstance) => (
        message = false,
        type = 'success',
      ) => {
        if (message && type === 'success') {
          return goToInstances(message, type);
        }
        return goToInstance(message, type);
      },
      breadcrumb: () => null,
    },
  });
};
