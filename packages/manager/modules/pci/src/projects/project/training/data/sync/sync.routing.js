export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.data.sync', {
    url: '/sync/:dataId',
    views: {
      modal: {
        component: 'pciProjectTrainingDataSyncComponent',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToData) => goToData,
      data: /* @ngInject */ ($stateParams) => $stateParams.dataId,
    },
  });
};
