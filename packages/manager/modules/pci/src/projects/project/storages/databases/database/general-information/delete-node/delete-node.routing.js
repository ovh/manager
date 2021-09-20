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
        onNodeDelete: /* @ngInject */ (database, goBackAndPoll) => (
          nodeInfo,
          message,
          type,
        ) => {
          database.setNodeStatus(nodeInfo, STATUS.DELETING);
          database.setStatus(STATUS.UPDATING);
          return goBackAndPoll(message, type);
        },
        price: /* @ngInject */ (getCurrentFlavor) =>
          getCurrentFlavor().nodeMonthlyPrice,
      },
    },
  );
};
