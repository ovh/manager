import find from 'lodash/find';
import {
  PLANS_WITHOUT_BACKUP,
  STATUS,
} from '../../../../../../components/project/storages/databases/databases.constants';
import { NEW_SUPPORT_TICKET_PARAMS } from './general-information.constants';
import isFeatureActivated from '../../features.constants';
import { RESTORE_MODES } from '../backups/fork/fork.constants';

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
      goBacktoGeneralInformation: /* @ngInject */ ($state) => () => {
        $state.go(stateName, {}, { reload: true });
      },
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
      goToIntegrations: /* @ngInject */ ($state, databaseId, projectId) => () =>
        $state.go(
          'pci.projects.project.storages.databases.dashboard.service-integration',
          {
            projectId,
            databaseId,
          },
        ),
      goToConfirmDeleteDatabase: /* @ngInject */ ($state, database) => (
        linkedServices,
      ) =>
        $state.go(
          'pci.projects.project.storages.databases.dashboard.general-information.confirm-delete',
          {
            database,
            linkedServices,
          },
        ),
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
      goToUpgradeStorage: /* @ngInject */ (
        $state,
        databaseId,
        projectId,
      ) => () =>
        $state.go(
          'pci.projects.project.storages.databases.dashboard.general-information.upgrade-storage',
          {
            projectId,
            databaseId,
          },
        ),
      goToSupportPage: /* @ngInject */ (coreURLBuilder, database) => () => {
        const url = coreURLBuilder.buildURL(
          'dedicated',
          '/support/tickets/new',
          {
            categoryName: NEW_SUPPORT_TICKET_PARAMS.CATEGORY_NAME,
            serviceTypeName:
              NEW_SUPPORT_TICKET_PARAMS.BASE_SERVICE_TYPE + database.engine,
          },
        );
        window.location.replace(url);
      },
      vRack: /* @ngInject */ (DatabaseService, projectId) =>
        DatabaseService.getVRack(projectId),
      vRackLink: /* @ngInject */ (vRack, coreURLBuilder) => {
        return coreURLBuilder.buildURL('dedicated', `#/vrack/${vRack.id}`);
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
        engine.getHighestFlavorRange(
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
        projectId,
      ) => () => {
        if (database.isProcessing()) {
          DatabaseService.pollDatabaseStatus(
            projectId,
            database.engine,
            database.id,
          ).then((databaseInfo) => {
            CucCloudMessage.flushMessages(`${stateName}-${databaseInfo.id}`);
            CucCloudMessage.success(
              $translate.instant(
                'pci_databases_general_information_database_ready',
              ),
              `${stateName}-${databaseInfo.id}`,
            );
            database.updateData(databaseInfo);
          });
        }
      },

      serviceIntegration: /* @ngInject */ (
        DatabaseService,
        database,
        projectId,
      ) =>
        isFeatureActivated('serviceIntegrationTab', database.engine)
          ? DatabaseService.getIntegrations(
              projectId,
              database.engine,
              database.id,
            )
          : [],
      users: /* @ngInject */ (DatabaseService, database, projectId) =>
        isFeatureActivated('usersTab', database.engine) ||
        isFeatureActivated('resetAdminUserFromDashboard', database.engine)
          ? DatabaseService.getUsers(projectId, database.engine, database.id)
          : [],
      stopPollingDatabaseStatus: /* @ngInject */ (
        DatabaseService,
        databaseId,
      ) => () => DatabaseService.stopPollingDatabaseStatus(databaseId),
      isFeatureActivated: /* @ngInject */ (engine) => (feature) =>
        isFeatureActivated(feature, engine.name),
      maintenances: /* @ngInject */ (DatabaseService, database, projectId) =>
        DatabaseService.getMaintenances(
          projectId,
          database.engine,
          database.id,
        ),
      backups: /* @ngInject */ (DatabaseService, database, projectId) =>
        isFeatureActivated('backupTab', database.engine) &&
        !PLANS_WITHOUT_BACKUP.includes(database.plan)
          ? DatabaseService.getBackups(
              projectId,
              database.engine,
              database.id,
            ).then((backups) =>
              backups.filter((backup) => backup.status === STATUS.READY),
            )
          : [],
      goToBackups: /* @ngInject */ (
        trackDashboard,
        $state,
        databaseId,
        projectId,
      ) => () => {
        trackDashboard('general_information::manage_backups');
        $state.go('pci.projects.project.storages.databases.dashboard.backups', {
          projectId,
          databaseId,
        });
      },
      goToFork: /* @ngInject */ (trackDashboard, $state) => () => {
        trackDashboard('general_information::fork');
        $state.go(
          'pci.projects.project.storages.databases.dashboard.backups.fork',
          {
            restoreMode: RESTORE_MODES.SOONEST,
          },
        );
      },
      goToMaintenances: /* @ngInject */ (
        trackDashboard,
        $state,
        databaseId,
        projectId,
      ) => () => {
        trackDashboard('general_information::maintenances');
        $state.go(
          'pci.projects.project.storages.databases.dashboard.maintenances',
          {
            projectId,
            databaseId,
          },
        );
      },
    },
  });
};
