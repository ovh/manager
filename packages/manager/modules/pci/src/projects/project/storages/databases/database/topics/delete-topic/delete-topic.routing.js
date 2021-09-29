export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.topics.delete-topic',
    {
      url: '/delete-topic',
      params: {
        topic: null,
      },
      views: {
        modal: {
          component: 'ovhManagerPciStoragesDatabaseTopicsDeleteTopicComponent',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ (goBackToTopics) => goBackToTopics,
        topic: /* @ngInject */ ($transition$) => $transition$.params().topic,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
