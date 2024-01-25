export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.ai.apps.dashboard.attach-data.data-sync',
    {
      url: '/data-sync/:volumeId',
      params: {
        volumeId: null,
        directory: null,
      },
      views: {
        modal: {
          component: 'ovhManagerPciProjectAiDataSync',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ (goBackToAttachData) => (message, type) => {
          return goBackToAttachData(message, type);
        },
        volumeId: /* @ngInject */ ($transition$) =>
          $transition$.params().volumeId,
        directory: /* @ngInject */ ($transition$) =>
          $transition$.params().directory,
        goToDataSync: /* @ngInject */ (dataSync) => (dataSyncParam) => {
          return dataSync(dataSyncParam);
        },
      },
    },
  );
};
