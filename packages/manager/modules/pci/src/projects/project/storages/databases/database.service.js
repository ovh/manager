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

import Backup from '../../../../components/project/storages/databases/backup.class';
import Database from '../../../../components/project/storages/databases/database.class';
import Engine from '../../../../components/project/storages/databases/engine.class';
import Lab from '../../../../components/project/labs/lab.class';
import Node from '../../../../components/project/storages/databases/node.class';

export default class DatabaseService {
  /* @ngInject */
  constructor(
    $http,
    $q,
    $translate,
    CucPriceHelper,
    PciProjectLabsService,
    Poller,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
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
          let prefix = `databases.${plan.engine}-${plan.plan}-${plan.flavor}`;
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

  getRoles(projectId, engine, databaseId) {
    if (isFeatureActivated('getRoles', engine)) {
      return this.$http
        .get(
          `/cloud/project/${projectId}/database/${engine}/${databaseId}/roles`,
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
      .get(
        `/cloud/project/${projectId}/vrack`,
        DatabaseService.getIcebergHeaders(),
      )
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

  addUser(projectId, engine, databaseId, user) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/user`,
        user,
      )
      .then(({ data }) => data);
  }

  editUser(projectId, engine, databaseId, user) {
    return this.$http
      .put(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/user/${user.id}`,
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
}
