import { STATUS } from '../../../../../../../components/project/storages/databases/databases.constants';

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
          getCurrentFlavor().nodeHourlyPrice,
        onNodeAdd: /* @ngInject */ (
          database,
          getNodeObject,
          pollDatabaseStatus,
          pollNodesStatus,
          goToDatabase,
        ) => (nodeInfo, message, type) => {
          database.addNode(getNodeObject(nodeInfo));
          database.setStatus(STATUS.UPDATING);
          pollDatabaseStatus();
          pollNodesStatus();
          return goToDatabase(database, message, type);
        },
      },
    },
  );
};
