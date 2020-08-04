export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.install', {
    url: '/install',
    // component: 'pciProjectTrainingInstallComponent',
    views: {
      modal: {
        component: 'pciProjectTrainingInstallComponent',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_training_install_title'),
      userLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.users', {
          projectId,
        }),
      goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
    },
  });
};
