export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.creating', {
      url: '/creating',
      views: {
        '@pci': {
          component: 'pciProjectCreating',
        },
      },
      resolve: {
        breadcrumb: () => null,
        onProjectCreated: /* @ngInject */ $state => () => $state.go('^'),
        projectOrder: /* @ngInject */ (project, projectCreating) => {
          if (project.orderId) {
            return projectCreating.getOrderDetails(project.orderId);
          }
          return null;
        },
      },
    });
};
