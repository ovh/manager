export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.topics',
    {
      url: '/topics',
      cache: false,
      views: {
        databaseView: 'ovhManagerPciStoragesDatabaseTopicsComponent',
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('pci_databases_topics_tab_title'),
        goBackToTopics: /* @ngInject */ ($state, CucCloudMessage) => (
          message = false,
          type = 'success',
        ) => {
          const reload = message && type === 'success';
          const state =
            'pci.projects.project.storages.databases.dashboard.topics';
          const promise = $state.go(state, {}, { reload });
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
        topicsList: /* @ngInject */ (database, DatabaseService, projectId) =>
          DatabaseService.getTopics(projectId, database.engine, database.id),
        addTopic: /* @ngInject */ ($state, databaseId, projectId) => () =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.topics.create-topic',
            {
              projectId,
              databaseId,
            },
          ),
        deleteTopic: /* @ngInject */ ($state) => (topic) =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.topics.delete-topic',
            {
              topic,
            },
          ),
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
