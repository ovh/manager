export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.data.add', {
    url: '/add',
    views: {
      'content@pci.projects.project.training':
        'pciProjectTrainingDataAddComponent',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_training_data_list_add'),
      goBack: /* @ngInject */ (goToData) => goToData,
    },
  });
};
