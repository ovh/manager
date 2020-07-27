export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.data.add', {
    url: '/add',
    component: 'pciProjectTrainingDataAddComponent',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) => $translate.instant('Add'),
      goBack: /* @ngInject */ (goToData) => goToData,
    },
  });
};
