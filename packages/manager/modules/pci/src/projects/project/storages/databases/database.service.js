import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import set from 'lodash/set';
import 'moment';
import isFeatureActivated from './features.constants';

import {
  ENGINES_STATUS,
  ENGINES_PRICE_SUFFIX,
} from '../../../../components/project/storages/databases/engines.constants';
import { DATABASE_TYPES } from './databases.constants';

import Backup from '../../../../components/project/storages/databases/backup.class';
import Database from '../../../../components/project/storages/databases/database.class';
import Engine from '../../../../components/project/storages/databases/engine.class';
import Lab from '../../../../components/project/labs/lab.class';
import Node from '../../../../components/project/storages/databases/node.class';
import ServiceIntegration from '../../../../components/project/storages/databases/serviceIntegration.class';
import User from '../../../../components/project/storages/databases/user.class';
import Pool from '../../../../components/project/storages/databases/pool.class';
import QueryStatistics from '../../../../components/project/storages/databases/queryStatistics.class';
import Namespace from '../../../../components/project/storages/databases/namespace.class';
import AvailableConnector from '../../../../components/project/storages/databases/availableConnector.class';
import Connector from '../../../../components/project/storages/databases/connector.class';
import IntegrationCapability from '../../../../components/project/storages/databases/integrationCapability.class';

export default class DatabaseService {
  /* @ngInject */
  constructor(
    $http,
    $q,
    $translate,
    iceberg,
    CucPriceHelper,
    PciProjectLabsService,
    Poller,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.iceberg = iceberg;
    this.CucPriceHelper = CucPriceHelper;
    this.PciProjectLabsService = PciProjectLabsService;
    this.Poller = Poller;
  }

  static getIcebergHeaders() {
    return {
      headers: {
        Pragma: 'no-cache',
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': 50000,
      },
    };
  }

  activateLab(projectId, lab) {
    return (lab.isOpen()
      ? this.PciProjectLabsService.activateLab(projectId, lab)
      : this.$q.resolve()
    ).then(() =>
      lab.isOpen() || lab.isActivating()
        ? this.pollLabActivationStatus(projectId, lab.id)
        : this.$q.resolve(),
    );
  }

  pollLabActivationStatus(projectId, labId) {
    return this.Poller.poll(
      `/cloud/project/${projectId}/lab/${labId}`,
      {},
      {
        namespace: `databases_${labId}`,
        interval: 2000,
        method: 'get',
        successRule: (lab) => new Lab(lab).isActivated(),
      },
    );
  }

  stopPollingLabActivationStatus(labId) {
    this.Poller.kill({ namespace: `databases_${labId}` });
  }

  addNode(projectId, engine, databaseId, flavor, region) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/node`,
        {
          flavor,
          region,
        },
      )
      .then(({ data }) => data);
  }

  deleteNode(projectId, engine, databaseId, nodeId) {
    return this.$http
      .delete(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/node/${nodeId}`,
      )
      .then(({ data }) => data);
  }

  addRestrictedIp(projectId, engine, databaseId, ip, description) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/ipRestriction`,
        {
          ip,
          description,
        },
      )
      .then(({ data }) => data);
  }

  createDatabase(projectId, engine, orderData) {
    return this.$http
      .post(`/cloud/project/${projectId}/database/${engine}`, orderData)
      .then(({ data }) => data);
  }

  createBackup(projectId, engine, databaseId, description) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/backup`,
        { description },
      )
      .then(({ data }) => data);
  }

  deleteDatabase(projectId, engine, databaseId) {
    return this.$http.delete(
      `/cloud/project/${projectId}/database/${engine}/${databaseId}`,
    );
  }

  deleteRestrictedIp(projectId, engine, databaseId, ipBlock) {
    return this.$http.delete(
      `/cloud/project/${projectId}/database/${engine}/${databaseId}/ipRestriction/${encodeURIComponent(
        ipBlock,
      )}`,
    );
  }

  editDatabase(
    projectId,
    engine,
    databaseId,
    description,
    plan,
    version,
    flavor,
  ) {
    return this.$http
      .put(`/cloud/project/${projectId}/database/${engine}/${databaseId}`, {
        description,
        plan,
        version,
        flavor,
      })
      .then(({ data }) => data);
  }

  updateDatabaseEngineProperties(projectId, engine, databaseId, properties) {
    return this.$http
      .put(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}`,
        properties,
      )
      .then(({ data }) => data);
  }

  editRestrictedIp(projectId, engine, databaseId, ipBlock, description) {
    return this.$http
      .put(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/ipRestriction/${encodeURIComponent(
          ipBlock,
        )}`,
        { description },
      )
      .then(({ data }) => data);
  }

  restoreBackup(projectId, engine, databaseId, backupId) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/backup/${backupId}/restore`,
      )
      .then(({ data }) => data);
  }

  restoreService(projectId, engine, databaseId, pointInTime) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/restore`,
        {
          pointInTime,
        },
      )
      .then(({ data }) => data);
  }

  getBackups(projectId, engine, databaseId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/backup`,
        DatabaseService.getIcebergHeaders(),
      )
      .then(({ data }) => map(data, (backup) => new Backup(backup)));
  }

  getAvailability(projectId) {
    return this.$http
      .get(`/cloud/project/${projectId}/database/availability`)
      .then(({ data }) => data);
  }

  getCapabilities(projectId) {
    return this.$http
      .get(`/cloud/project/${projectId}/database/capabilities`)
      .then(({ data }) => data);
  }

  getEngines(projectId) {
    return this.$q
      .all({
        availability: this.getAvailability(projectId),
        capabilities: this.getCapabilities(projectId),
        prices: this.CucPriceHelper.getPrices(projectId),
      })
      .then(({ availability, capabilities, prices }) => {
        availability.forEach((plan) => {
          let prefix = `databases.${plan.engine.toLowerCase()}-${plan.plan}-${
            plan.flavor
          }`;
          if (plan.status === ENGINES_STATUS.BETA) {
            if (
              prices[`${prefix}-${ENGINES_PRICE_SUFFIX.BETA}.hour.consumption`]
            ) {
              prefix = `${prefix}-${ENGINES_PRICE_SUFFIX.BETA}`;
            }
          }
          set(
            plan,
            'hourlyPrice',
            get(prices, `${prefix}.hour.consumption`, {}),
          );
          set(
            plan,
            'monthlyPrice',
            get(prices, `${prefix}.month.consumption`, {}),
          );
          // set storage prices
          set(
            plan,
            'hourlyPricePerGB',
            get(
              prices,
              `databases.${plan.engine.toLowerCase()}-${
                plan.plan
              }-additionnal-storage-gb.hour.consumption`,
              {},
            ),
          );
          set(
            plan,
            'monthlyPricePerGB',
            get(
              prices,
              `databases.${plan.engine.toLowerCase()}-${
                plan.plan
              }-additionnal-storage-gb.month.consumption`,
              {},
            ),
          );
          set(
            plan,
            'flavor',
            find(capabilities.flavors, { name: plan.flavor }),
          );
          set(plan, 'plan', find(capabilities.plans, { name: plan.plan }));
        });
        return capabilities.engines.map(
          (engine) =>
            new Engine(
              engine,
              availability,
              capabilities.plans,
              capabilities.flavors,
            ),
        );
      });
  }

  getDatabaseDetails(projectId, engine, databaseId) {
    return this.$http
      .get(`/cloud/project/${projectId}/database/${engine}/${databaseId}`)
      .then(({ data }) => data);
  }

  getDatabases(projectId, engine) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}`,
        DatabaseService.getIcebergHeaders(),
      )
      .then((databases) =>
        databases.data.map((database) => ({
          ...database,
          engine,
        })),
      );
  }

  getAllDatabases(projectId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/service`,
        DatabaseService.getIcebergHeaders(),
      )
      .then((databases) => databases.data);
  }

  getIpRestrictions(projectId, engine, databaseId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/ipRestriction`,
        DatabaseService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getRoles(projectId, engine, databaseId, advanced) {
    if (isFeatureActivated('getRoles', engine)) {
      return this.$http
        .get(
          `/cloud/project/${projectId}/database/${engine}/${databaseId}/roles`,
          {
            params: advanced ? { advanced: 1 } : null,
          },
          DatabaseService.getIcebergHeaders(),
        )
        .then(({ data }) => data);
    }
    return this.$q.when([]);
  }

  getNodes(projectId, engine, databaseId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/node`,
        DatabaseService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getPrivateNetworks(projectId) {
    return this.$http
      .get(`/cloud/project/${projectId}/network/private`)
      .then(({ data: networks }) =>
        filter(networks, {
          type: 'private',
        }),
      );
  }

  getVRack(projectId) {
    return this.$http
      .get(`/cloud/project/${projectId}/vrack`)
      .then(({ data }) => data)
      .catch((error) => (error.status === 404 ? [] : this.$q.reject(error)));
  }

  getSubnets(projectId, networkId) {
    return this.$http
      .get(`/cloud/project/${projectId}/network/private/${networkId}/subnet`)
      .then(({ data: subnets }) => subnets);
  }

  getUsers(projectId, engine, databaseId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/user`,
        DatabaseService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  pollUserStatus(projectId, engine, databaseId, userId) {
    return this.Poller.poll(
      `/cloud/project/${projectId}/database/${engine}/${databaseId}/user/${userId}`,
      {},
      {
        namespace: `databases_${databaseId}_user_${userId}`,
        interval: 2000,
        method: 'get',
        successRule: (user) => !new User(user).isProcessing(),
      },
    );
  }

  stopPollingUserStatus(databaseId, userId) {
    this.Poller.kill({ namespace: `databases_${databaseId}_user_${userId}` });
  }

  addUser(projectId, engine, databaseId, user) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/user`,
        user,
      )
      .then(({ data }) => data);
  }

  editUser(projectId, engine, databaseId, userId, user) {
    return this.$http
      .put(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/user/${userId}`,
        user,
      )
      .then(({ data }) => data);
  }

  deleteUser(projectId, engine, databaseId, userId) {
    return this.$http
      .delete(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/user/${userId}`,
      )
      .then(() => true)
      .catch((error) => (error.status === 403 ? false : this.$q.reject(error)));
  }

  getAvailableMetrics(projectId, engine, databaseId, extended) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/metric`,
        {
          params: {
            extended,
          },
        },
      )
      .then(({ data }) => data);
  }

  getMetrics(projectId, engine, databaseId, metricName, period) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/metric/${metricName}`,
        {
          params: {
            period,
          },
        },
      )
      .then(({ data }) => data);
  }

  resetUserCredentials(projectId, engine, databaseId, userId) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/user/${userId}/credentials/reset`,
      )
      .then(({ data }) => data);
  }

  pollDatabaseStatus(projectId, engine, databaseId) {
    return this.Poller.poll(
      `/cloud/project/${projectId}/database/${engine}/${databaseId}`,
      {},
      {
        namespace: `databases_${databaseId}`,
        method: 'get',
        successRule: (database) => !new Database(database).isProcessing(),
      },
    );
  }

  pollNodeStatus(projectId, engine, databaseId, nodeId) {
    return this.Poller.poll(
      `/cloud/project/${projectId}/database/${engine}/${databaseId}/node/${nodeId} `,
      {},
      {
        retryMaxAttempts: 0,
        namespace: `databases_${databaseId}_${nodeId}`,
        method: 'get',
        successRule: (node) => !new Node(node).isProcessing(),
        errorRule: (error) => error.status === 404,
      },
    ).catch((error) => (error.status === 404 ? true : this.$q.reject(error)));
  }

  stopPollingDatabaseStatus(databaseId) {
    this.Poller.kill({ namespace: `databases_${databaseId}` });
  }

  stopPollingNodeStatus(databaseId, nodeId) {
    this.Poller.kill({ namespace: `databases_${databaseId}_${nodeId}` });
  }

  getDatabaseLogs(projectId, engine, databaseId) {
    return this.$http
      .get(`/cloud/project/${projectId}/database/${engine}/${databaseId}/logs`)
      .then(({ data }) => data);
  }

  getServiceDatabases(projectId, engine, databaseId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/database`,
        DatabaseService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  addServiceDatabase(projectId, engine, databaseId, databaseName) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/database`,
        {
          name: databaseName,
        },
      )
      .then(({ data }) => data);
  }

  deleteServiceDatabase(projectId, engine, databaseId, db) {
    return this.$http
      .delete(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/database/${db.id}`,
      )
      .then(({ data }) => data);
  }

  getServiceAcl(projectId, engine, databaseId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/acl`,
        DatabaseService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  addServiceAcl(projectId, engine, databaseId, username, topic, permission) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/acl`,
        {
          username,
          topic,
          permission,
        },
      )
      .then(({ data }) => data);
  }

  deleteServiceAcl(projectId, engine, databaseId, aclId) {
    return this.$http.delete(
      `/cloud/project/${projectId}/database/${engine}/${databaseId}/acl/${aclId}`,
    );
  }

  getPermissions(projectId, engine, databaseId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/permissions`,
      )
      .then(({ data }) => data);
  }

  getCertificate(projectId, engine, databaseId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/certificates`,
      )
      .then(({ data }) => data);
  }

  getUserCertificate(projectId, engine, databaseId, userId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/user/${userId}/access`,
      )
      .then(({ data }) => data);
  }

  getTopics(projectId, engine, databaseId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/topic`,
        DatabaseService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  addTopic(projectId, engine, databaseId, topic) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/topic`,
        {
          name: topic.name,
          partitions: topic.partitions,
          replication: topic.replication,
          minInsyncReplicas: topic.minInsyncReplicas,
          retentionHours: topic.retentionHours,
          retentionBytes: topic.retentionBytes,
        },
      )
      .then(({ data }) => data);
  }

  deleteTopic(projectId, engine, databaseId, topicId) {
    return this.$http
      .delete(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/topic/${topicId}`,
      )
      .then(({ data }) => data);
  }

  setUserAclStatus(projectId, engine, databaseId, aclsEnabled) {
    return this.$http
      .put(`/cloud/project/${projectId}/database/${engine}/${databaseId}`, {
        aclsEnabled,
      })
      .then(({ data }) => data);
  }

  editUserAcl(projectId, engine, databaseId, acls, userId) {
    return this.$http
      .put(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/user/${userId}`,
        {
          acls,
        },
      )
      .then(({ data }) => data);
  }

  getIndexes(projectId, engine, databaseId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/index`,
        DatabaseService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  deleteIndex(projectId, engine, databaseId, indexId) {
    return this.$http
      .delete(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/index/${indexId}`,
      )
      .then(({ data }) => data);
  }

  getPatterns(projectId, engine, databaseId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/pattern`,
        DatabaseService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  addPattern(projectId, engine, databaseId, pattern) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/pattern`,
        {
          pattern: pattern.pattern,
          maxIndexCount: pattern.maxIndexCount,
        },
      )
      .then(({ data }) => data);
  }

  deletePattern(projectId, engine, databaseId, patternId) {
    return this.$http
      .delete(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/pattern/${patternId}`,
      )
      .then(({ data }) => data);
  }

  getIntegrationCapabilities(projectId, engine, databaseId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/capabilities/integration`,
        DatabaseService.getIcebergHeaders(),
      )
      .then(({ data: integrationCapabilities }) =>
        integrationCapabilities.map(
          (integrationCapability) =>
            new IntegrationCapability(integrationCapability),
        ),
      );
  }

  getIntegrations(projectId, engine, databaseId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/integration`,
        DatabaseService.getIcebergHeaders(),
      )
      .then(({ data: integrations }) =>
        integrations.map((integration) => new ServiceIntegration(integration)),
      );
  }

  getLinkedServices(projectId, engine, databaseId, servicesList) {
    return this.getIntegrations(projectId, engine, databaseId).then(
      (integrations) =>
        Array.from(
          integrations.reduce(
            (databases, { sourceServiceId, destinationServiceId }) => {
              if (
                sourceServiceId === destinationServiceId ||
                databaseId !== sourceServiceId
              ) {
                databases.add(
                  servicesList.find(({ id }) => id === sourceServiceId),
                );
              } else if (databaseId !== destinationServiceId) {
                databases.add(
                  servicesList.find(({ id }) => id === destinationServiceId),
                );
              }
              return databases;
            },
            new Set(),
          ),
        ),
    );
  }

  pollIntegrationStatus(projectId, engine, databaseId, integrationId) {
    return this.Poller.poll(
      `/cloud/project/${projectId}/database/${engine}/${databaseId}/integration/${integrationId}`,
      {},
      {
        namespace: `databases_${databaseId}_integration_${integrationId}`,
        method: 'get',
        successRule: (integration) =>
          !new ServiceIntegration(integration).isProcessing(),
      },
    );
  }

  stopPollingIntegrationStatus(databaseId, integrationId) {
    this.Poller.kill({
      namespace: `databases_${databaseId}_integration_${integrationId}`,
    });
  }

  addIntegration(
    projectId,
    engine,
    databaseId,
    sourceServiceId,
    destinationServiceId,
    type,
    parameters,
  ) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/integration`,
        {
          sourceServiceId,
          destinationServiceId,
          type,
          parameters,
        },
      )
      .then(({ data }) => data);
  }

  deleteIntegration(projectId, engine, databaseId, integration) {
    return this.$http
      .delete(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/integration/${integration.id}`,
      )
      .then(({ data }) => data);
  }

  getReplications(projectId, engine, databaseId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/replication`,
        DatabaseService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  addReplication(projectId, engine, databaseId, replication) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/replication`,
        {
          sourceIntegration: replication.sourceIntegration,
          targetIntegration: replication.targetIntegration,
          emitHeartbeats: replication.emitHeartbeats,
          enabled: replication.enabled,
          replicationPolicyClass: replication.replicationPolicyClass,
          syncGroupOffsets: replication.syncGroupOffsets,
          syncInterval: replication.syncInterval,
          topicExcludeList: replication.topicExcludeList,
          topics: replication.topics,
        },
      )
      .then(({ data }) => data);
  }

  updateReplication(projectId, engine, databaseId, replication) {
    return this.$http
      .put(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/replication/${replication.id}`,
        {
          emitHeartbeats: replication.emitHeartbeats,
          enabled: replication.enabled,
          replicationPolicyClass: replication.replicationPolicyClass,
          syncGroupOffsets: replication.syncGroupOffsets,
          syncInterval: replication.syncInterval,
          topicExcludeList: replication.topicExcludeList,
          topics: replication.topics,
        },
      )
      .then(({ data }) => data);
  }

  deleteReplication(projectId, engine, databaseId, replication) {
    return this.$http
      .delete(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/replication/${replication.id}`,
      )
      .then(({ data }) => data);
  }

  getCurrentQueries(serviceName, databaseId, databaseEngine) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/database/${databaseEngine}/${databaseId}/currentQueries`,
        DatabaseService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  postTerminateQuery(
    serviceName,
    databaseId,
    databaseEngine,
    queryPid,
    terminateRequest,
  ) {
    return this.$http
      .post(
        `/cloud/project/${serviceName}/database/${databaseEngine}/${databaseId}/currentQueries/cancel`,
        { pid: queryPid, terminate: terminateRequest },
      )
      .then(({ data }) => data);
  }

  getPools(projectId, databaseId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/postgresql/${databaseId}/connectionPool`,
        DatabaseService.getIcebergHeaders(),
      )
      .then(({ data: pools }) => pools.map((pool) => new Pool(pool)));
  }

  /**
   *
   * @param {*} projectId
   * @param {*} engine
   * @param {*} databaseId
   * @param {*} pageSize
   * @param {*} page
   * @returns [QueryStatistics,.....N]
   */
  // TBD: pagesize and page to be enabled when the API supports pagination
  getQueryStatistics(
    projectId,
    engine,
    databaseId,
    // pageSize,
    // page
  ) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/queryStatistics`,
        DatabaseService.getIcebergHeaders(),
      )
      .then(({ data: stats }) =>
        stats[0].map((query) => {
          return engine === DATABASE_TYPES.POSTGRESQL
            ? new QueryStatistics(
                query.query,
                query.rows,
                query.calls,
                query.minTime,
                query.maxTime,
                query.meanTime,
                query.stddevTime,
                query.totalTime,
              )
            : new QueryStatistics(
                query.digestText,
                query.sumRowsSent,
                query.countStar,
                query.minTimerWait,
                query.maxTimerWait,
                query.avgTimerWait,
                0,
                query.sumTimerWait,
              );
        }),
      );
  }

  resetQueryStatistics(projectId, engine, databaseId) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/queryStatistics/reset`,
      )
      .then(({ data }) => data);
  }

  createConnectionPool(projectId, engine, databaseId, payload) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/connectionPool`,
        payload,
      )
      .then(({ data }) => data);
  }

  updateConnectionPool(
    projectId,
    engine,
    databaseId,
    connectionPoolId,
    payload,
  ) {
    return this.$http
      .put(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/connectionPool/${connectionPoolId}`,
        payload,
      )
      .then(({ data }) => data);
  }

  terminateConnectionPool(projectId, engine, databaseId, connectionPoolId) {
    return this.$http
      .delete(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/connectionPool/${connectionPoolId}`,
      )
      .then(({ data }) => data);
  }

  getAdvancedConfigurationList(projectId, engine, databaseId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/capabilities/advancedConfiguration`,
        DatabaseService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getAdvancedConfiguration(projectId, engine, databaseId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/advancedConfiguration`,
      )
      .then(({ data }) => data);
  }

  editAdvancedConfiguration(
    projectId,
    engine,
    databaseId,
    advancedConfiguration,
  ) {
    return this.$http
      .put(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/advancedConfiguration`,
        advancedConfiguration,
      )
      .then(({ data }) => data);
  }

  getNamespaces(projectId, engine, databaseId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/namespace`,
        DatabaseService.getIcebergHeaders(),
      )
      .then(({ data: namespaces }) =>
        namespaces.map((namespace) => new Namespace(namespace)),
      );
  }

  addNamespace(projectId, engine, databaseId, namespace) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/namespace`,
        namespace,
      )
      .then(({ data }) => data);
  }

  editNamespace(projectId, engine, databaseId, namespaceId, namespace) {
    return this.$http
      .put(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/namespace/${namespaceId}`,
        namespace,
      )
      .then(({ data }) => data);
  }

  deleteNamespace(projectId, engine, databaseId, namespaceId) {
    return this.$http
      .delete(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/namespace/${namespaceId}`,
      )
      .then(({ data }) => data);
  }

  getAvailableConnectors(projectId, engine, databaseId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/capabilities/connector`,
        DatabaseService.getIcebergHeaders(),
      )
      .then(({ data }) =>
        data.map(
          (availableConnector) => new AvailableConnector(availableConnector),
        ),
      );
  }

  getAvailableConnector(projectId, engine, databaseId, connectorId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/capabilities/connector/${connectorId}`,
      )
      .then(({ data: connector }) => new AvailableConnector(connector));
  }

  getAvailableConnectorConfiguration(
    projectId,
    engine,
    databaseId,
    connectorId,
  ) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/capabilities/connector/${connectorId}/configuration`,
        DatabaseService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getAvailableConnectorTransformsConfiguration(
    projectId,
    engine,
    databaseId,
    connectorId,
  ) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/capabilities/connector/${connectorId}/transforms`,
        DatabaseService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getConnectors(projectId, engine, databaseId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/connector`,
        DatabaseService.getIcebergHeaders(),
      )
      .then(({ data }) => data.map((connector) => new Connector(connector)));
  }

  getConnector(projectId, engine, databaseId, connectorId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/connector/${connectorId}`,
      )
      .then(({ data }) => new Connector(data));
  }

  poolConnector(projectId, engine, databaseId, connectorId) {
    return this.Poller.poll(
      `/cloud/project/${projectId}/database/${engine}/${databaseId}/connector/${connectorId}`,
      {},
      {
        namespace: `databases_${databaseId}_conntector_${connectorId}`,
        method: 'get',
        interval: 10000,
      },
    );
  }

  stopPollingConnector(databaseId, connectorId) {
    this.Poller.kill({
      namespace: `databases_${databaseId}_conntector_${connectorId}`,
    });
  }

  getConnectorTasks(projectId, engine, databaseId, connectorId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/connector/${connectorId}/task`,
        DatabaseService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getConnectorTask(projectId, engine, databaseId, connectorId, taskId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/connector/${connectorId}/task/${taskId}`,
      )
      .then(({ data }) => data);
  }

  poolConnectorTasks(projectId, engine, databaseId, connectorId) {
    return this.Poller.poll(
      `/cloud/project/${projectId}/database/${engine}/${databaseId}/connector/${connectorId}/task`,
      DatabaseService.getIcebergHeaders(),
      {
        namespace: `databases_${databaseId}_conntector_${connectorId}_tasks`,
        method: 'get',
        interval: 10000,
      },
    );
  }

  stopPollingConnectorTasks(databaseId, connectorId) {
    this.Poller.kill({
      namespace: `databases_${databaseId}_conntector_${connectorId}_tasks`,
    });
  }

  restartConnectorTask(projectId, engine, databaseId, connectorId, taskId) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/connector/${connectorId}/task/${taskId}/restart`,
      )
      .then(({ data }) => data);
  }

  postConnector(projectId, engine, databaseId, connector) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/connector`,
        connector,
      )
      .then(({ data }) => data);
  }

  putConnector(projectId, engine, databaseId, connectorId, connector) {
    return this.$http
      .put(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/connector/${connectorId}`,
        connector,
      )
      .then(({ data }) => data);
  }

  deleteConnector(projectId, engine, databaseId, connectorId) {
    return this.$http
      .delete(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/connector/${connectorId}`,
      )
      .then(({ data }) => data);
  }

  pauseConnector(projectId, engine, databaseId, connectorId) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/connector/${connectorId}/pause`,
      )
      .then(({ data }) => data);
  }

  resumeConnector(projectId, engine, databaseId, connectorId) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/connector/${connectorId}/resume`,
      )
      .then(({ data }) => data);
  }

  restartConnector(projectId, engine, databaseId, connectorId) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/connector/${connectorId}/restart`,
      )
      .then(({ data }) => data);
  }

  getMaintenances(projectId, engine, databaseId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/maintenance`,
        DatabaseService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  applyMaintenance(projectId, engine, databaseId, maintenanceId) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/maintenance/${maintenanceId}/apply`,
      )
      .then(({ data }) => data);
  }
}
