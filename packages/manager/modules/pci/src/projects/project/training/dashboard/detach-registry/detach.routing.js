export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.training.dashboard.detach-registry',
    {
      url: '/detach-registry',
      views: {
        modal: {
          component: 'ovhManagerPciProjectTrainingDashboardDetachRegistry',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
        breadcrumb: () => null,
      },
    },
  );
};
