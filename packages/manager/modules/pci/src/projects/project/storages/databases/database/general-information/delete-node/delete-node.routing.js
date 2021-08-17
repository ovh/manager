import { STATUS } from '../../../../../../../components/project/storages/databases/databases.constants';

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
          database.setNodeStatus(nodeInfo, STATUS.DELETING);
          pollNodesStatus();
          return goToDatabase(database, message, type);
        },
        getCurrentFlavor: /* @ngInject */ (database, engine) => () =>
          engine.getFlavor(
            database.version,
            database.plan,
            database.region,
            database.flavor,
          ),
      },
    },
  );
};
