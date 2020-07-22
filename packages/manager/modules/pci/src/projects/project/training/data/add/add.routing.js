export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.data.add', {
    url: '/add',
    views: {
      dataView: 'pciProjectTrainingDataAddComponent',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) => $translate.instant('Add'),
    },
  });
};
