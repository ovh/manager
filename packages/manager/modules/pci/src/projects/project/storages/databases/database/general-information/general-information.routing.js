import find from 'lodash/find';
import { buildURL } from '@ovh-ux/ufrontend/url-builder';
import { STATUS } from '../../../../../../components/project/storages/databases/databases.constants';
import isFeatureActivated from '../../features.constants';

export default /* @ngInject */ ($stateProvider) => {
  const stateName =
    'pci.projects.project.storages.databases.dashboard.general-information';
  $stateProvider.state(stateName, {
    url: '/general-information',
    views: {
      databaseView: 'ovhManagerPciProjectDatabaseGeneralInformation',
    },
    resolve: {
      billingLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.billing', {
          projectId,
        }),
      breadcrumb: () => false,
      goToAddNode: /* @ngInject */ ($state, databaseId, projectId) => () =>
        $state.go(
          'pci.projects.project.storages.databases.dashboard.general-information.add-node',
          {
            projectId,
            databaseId,
          },
        ),
      goToDeleteNode: /* @ngInject */ ($state, databaseId, projectId) => () =>
        $state.go(
          'pci.projects.project.storages.databases.dashboard.general-information.delete-node',
          {
            projectId,
            databaseId,
          },
        ),
      goToAllowedIPs: /* @ngInject */ ($state, databaseId, projectId) => () =>
        $state.go(
          'pci.projects.project.storages.databases.dashboard.allowed-ips',
          {
            projectId,
            databaseId,
          },
        ),
      goToManagerUsers: /* @ngInject */ ($state, databaseId, projectId) => () =>
        $state.go('pci.projects.project.storages.databases.dashboard.users', {
          projectId,
          databaseId,
        }),
      goToDeleteDatabase: /* @ngInject */ ($state, database, projectId) => () =>
        $state.go(
          'pci.projects.project.storages.databases.dashboard.general-information.delete',
          {
            projectId,
            database,
          },
        ),
      goToEditName: /* @ngInject */ ($state, databaseId, projectId) => () =>
        $state.go(
          'pci.projects.project.storages.databases.dashboard.general-information.name',
          {
            projectId,
            databaseId,
          },
        ),
      goToUpgradePlan: /* @ngInject */ ($state, databaseId, projectId) => () =>
        $state.go(
          'pci.projects.project.storages.databases.dashboard.general-information.upgrade-plan',
          {
            projectId,
            databaseId,
          },
        ),
      goToUpgradeVersion: /* @ngInject */ (
        $state,
        databaseId,
        projectId,
      ) => () =>
        $state.go(
          'pci.projects.project.storages.databases.dashboard.general-information.upgrade-version',
          {
            projectId,
            databaseId,
          },
        ),
      goToUpgradeNode: /* @ngInject */ ($state, databaseId, projectId) => () =>
        $state.go(
          'pci.projects.project.storages.databases.dashboard.general-information.upgrade-node',
          {
            projectId,
            databaseId,
          },
        ),
      goToFork: /* @ngInject */ ($state, database) => () =>
        $state.go('pci.projects.project.storages.databases.fork', {
          database,
        }),
      vRack: /* @ngInject */ (DatabaseService, projectId) =>
        DatabaseService.getVRack(projectId),
      vRackLink: /* @ngInject */ (vRack) => {
        return buildURL('dedicated', `#/vrack/${vRack.id}`);
      },
      goBack: /* @ngInject */ (database, goToDatabase) => (message, type) =>
        goToDatabase(database, message, type),
      goBackAndPoll: /* @ngInject */ (goBack, pollDatabaseStatus) => (
        message,
        type,
      ) => {
        pollDatabaseStatus();
        return goBack(message, type);
      },
      getCurrentFlavor: /* @ngInject */ (database, engine) => () =>
        engine.getFlavor(
          database.version,
          database.plan,
          database.region,
          database.flavor,
        ),
      getCurrentPlan: /* @ngInject */ (database, engine) => () =>
        engine.getPlan(database.version, database.plan),
      latestPlan: /* @ngInject */ (database, engine) =>
        engine.getLatestPlan(database.version, database.region).name,
      latestVersion: /* @ngInject */ (engine) =>
        engine.getLatestVersion().version,
      highestFlavor: /* @ngInject */ (database, engine) =>
        engine.getHighestFlavor(
          database.version,
          database.region,
          database.plan,
        ).name,
      privateNetwork: /* @ngInject */ (database, privateNetworks) =>
        find(privateNetworks, (privateNetwork) =>
          find(privateNetwork.regions, { openstackId: database.networkId }),
        ),
      subnet: /* @ngInject */ (
        DatabaseService,
        database,
        projectId,
        privateNetwork,
      ) =>
        privateNetwork
          ? DatabaseService.getSubnets(projectId, privateNetwork.id)
              .then((subnets) => find(subnets, { id: database.subnetId }))
              .then((subnet) => ({
                ...subnet,
                name: `${subnet.ipPools[0].network} - ${subnet.ipPools[0].region}`,
              }))
          : undefined,
      pollDatabaseStatus: /* @ngInject */ (
        $translate,
        CucCloudMessage,
        DatabaseService,
        database,
        getNodes,
        pollNodesStatus,
        projectId,
      ) => () => {
        if (database.isProcessing()) {
          DatabaseService.pollDatabaseStatus(
            projectId,
            database.engine,
            database.id,
          )
            .then((databaseInfo) => {
              CucCloudMessage.flushMessages(stateName);
              CucCloudMessage.success(
                $translate.instant(
                  'pci_databases_general_information_database_ready',
                ),
                stateName,
              );
              database.updateData(databaseInfo);
              return getNodes(database).then((nodes) =>
                database.setNodes(nodes),
              );
            })
            .finally(() => {
              return pollNodesStatus();
            });
        }
      },
      pollNodesStatus: /* @ngInject */ (
        $translate,
        CucCloudMessage,
        DatabaseService,
        database,
        projectId,
      ) => () => {
        database.nodes.forEach((node) => {
          if (node.isProcessing()) {
            const successMessage =
              node.status === STATUS.DELETING
                ? 'pci_databases_general_information_delete_node_success'
                : 'pci_databases_general_information_node_ready';
            DatabaseService.pollNodeStatus(
              projectId,
              database.engine,
              database.id,
              node.id,
            ).then((nodeInfo) => {
              CucCloudMessage.flushMessages(stateName);
              CucCloudMessage.success(
                $translate.instant(successMessage, { nodeName: node.name }),
                stateName,
              );
              if (node.status === STATUS.DELETING) {
                database.deleteNode(node.id);
              } else {
                node.updateData(nodeInfo);
              }
            });
          }
        });
      },
      users: /* @ngInject */ (DatabaseService, database, projectId) =>
        DatabaseService.getUsers(projectId, database.engine, database.id),
      stopPollingDatabaseStatus: /* @ngInject */ (
        DatabaseService,
        databaseId,
      ) => () => DatabaseService.stopPollingDatabaseStatus(databaseId),
      stopPollingNodesStatus: /* @ngInject */ (
        DatabaseService,
        database,
      ) => () =>
        database.nodes.forEach((node) =>
          DatabaseService.stopPollingNodeStatus(node.id),
        ),
      isFeatureActivated: /* @ngInject */ (engine) => (feature) =>
        isFeatureActivated(feature, engine.name),
    },
  });
};
