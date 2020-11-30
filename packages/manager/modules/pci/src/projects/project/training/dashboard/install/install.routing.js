export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.dashboard.install', {
    url: '/install',
    views: {
      modal: {
        component: 'pciProjectTrainingInstallComponent',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_training_install_title'),
      goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
    },
  });
};
