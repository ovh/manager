import { STATUS } from '../../../../../../../components/project/storages/databases/databases.constants';
import Node from '../../../../../../../components/project/storages/databases/node.class';

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
        onNodeAdd: /* @ngInject */ (database, goBackAndPoll) => (
          nodeInfo,
          message,
          type,
        ) => {
          database.addNode(new Node(nodeInfo));
          database.setStatus(STATUS.UPDATING);
          return goBackAndPoll(message, type);
        },
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
