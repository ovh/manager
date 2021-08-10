export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.general-information.delete-node',
    {
      url: '/delete-node',
      views: {
        modal: {
          component: 'ovhManagerPciProjectDatabaseGeneralInformationDeleteNode',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        onNodeDelete: /* @ngInject */ (
          database,
          getNodeObject,
          goToDatabase,
          pollNodesStatus,
        ) => (nodeInfo, message, type) => {
          database.deleteNode(getNodeObject(nodeInfo));
          pollNodesStatus();
          return goToDatabase(database, message, type);
        },
      },
    },
  );
};
