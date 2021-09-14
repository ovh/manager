import find from 'lodash/find';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.databases.name', {
    url: '/:databaseId/name',
    views: {
      modal: {
        component: 'ovhManagerPciProjectDatabaseName',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
      databaseId: /* @ngInject */ ($transition$) =>
        $transition$.params().databaseId,
      database: /* @ngInject */ (databaseId, databases) =>
        find(databases, { id: databaseId }),
    },
  });
};
