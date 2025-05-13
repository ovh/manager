export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.topics.create-topic',
    {
      url: '/create-topic',
      views: {
        modal: {
          component: 'ovhManagerPciStoragesDatabaseTopicsCreateTopicComponent',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ (goBackToTopics) => goBackToTopics,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
