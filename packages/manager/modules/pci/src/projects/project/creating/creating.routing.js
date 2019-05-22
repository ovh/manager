export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.creating', {
      url: '/creating',
      views: {
        '@pci': {
          componentProvider: /* @ngInject */ projectOrder => (projectOrder ? 'pciProjectCreatingNotPaid' : 'pciProjectCreating'),
          // component: 'pciProjectCreating',
        },
      },
      resolve: {
        breadcrumb: () => null,
        onProjectCreated: /* @ngInject */ $state => () => $state.go('^'),
        projectOrder: /* @ngInject */ (project, projectCreating, projectOrderStatus) => {
          if (project.orderId && projectOrderStatus === 'notPaid') {
            return projectCreating
              .getOrderDetails(project.orderId);
          }
          return null;
        },
        projectOrderStatus: /* @ngInject */ (project, projectCreating) => {
          if (project.orderId) {
            return projectCreating
              .getOrderStatus(project.orderId)
              .then(({ status }) => status);
          }
          return null;
        },
      },
    });
};
