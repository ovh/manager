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
        price: /* @ngInject */ (getCurrentFlavor, engines, database) => {
          const currentFlavor = getCurrentFlavor();
          const flavorPrice = currentFlavor.nodeHourlyPrice;
          const dbEngine = engines.find(
            (engine) => engine.name === database.engine,
          );
          let addedStorageByNode =
            database.disk.size - currentFlavor.minDiskSize;
          // if engine is distributed, the stockage is distributed between the nodes, so to get the
          // size of for one node, we need to divide by the number of nodes
          if (dbEngine.isDistributedStorage) {
            addedStorageByNode /= database.nodeNumber;
          }
          const additionalStoragePrice = Math.max(
            0,
            addedStorageByNode * currentFlavor.hourlyPricePerGB.priceInUcents,
          );
          return flavorPrice.priceInUcents + additionalStoragePrice;
        },
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
      atInternet: {
        ignore: true,
      },
    },
  );
};
