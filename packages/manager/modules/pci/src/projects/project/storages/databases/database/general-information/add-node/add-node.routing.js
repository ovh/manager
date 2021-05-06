export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.general-information.add-node',
    {
      url: '/add-node',
      views: {
        modal: {
          component: 'ovhManagerPciProjectDatabaseGeneralInformationAddNode',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        price: /* @ngInject */ (getCurrentFlavor) =>
          getCurrentFlavor().nodeMonthlyPrice,
        onNodeAdd: /* @ngInject */ (
          database,
          getNodeObject,
          goToDatabase,
          pollNodesStatus,
        ) => (nodeInfo, message, type) => {
          database.addNode(getNodeObject(nodeInfo));
          pollNodesStatus();
          return goToDatabase(database, message, type);
        },
      },
    },
  );
};
