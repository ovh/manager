export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.dashboard.registry', {
    url: '/registry',
    views: {
      modal: {
        component: 'pciProjectTrainingRegistryComponent',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_training_registry_title'),
      goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
    },
  });
};
