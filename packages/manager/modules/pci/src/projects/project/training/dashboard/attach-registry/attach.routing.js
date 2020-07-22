export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.training.dashboard.attach-registry',
    {
      url: '/attach-registry',
      views: {
        modal: {
          component:
            'ovhManagerPciProjectTrainingDashboardAttachRegistryComponent',
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
