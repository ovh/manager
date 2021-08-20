import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import set from 'lodash/set';
import 'moment';

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
          set(
            plan,
            'hourlyPrice',
            get(
              prices,
              `databases.${plan.engine}-${plan.plan}-${plan.flavor}-launch.hour.consumption`,
              {},
            ),
          );
          set(
            plan,
            'monthlyPrice',
            get(
              prices,
              `databases.${plan.engine}-${plan.plan}-${plan.flavor}-launch.month.consumption`,
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

  getIpRestrictions(projectId, engine, databaseId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/ipRestriction`,
        DatabaseService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getRoles(projectId, engine, databaseId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/roles`,
        DatabaseService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
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
      .then(({ data }) => data);
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

  addUser(projectId, engine, databaseId, name, password, roles) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/user`,
        {
          name,
          password,
          roles,
        },
      )
      .then(({ data }) => data);
  }

  editUser(projectId, engine, databaseId, userId, password) {
    return this.$http
      .put(
        `/cloud/project/${projectId}/database/${engine}/${databaseId}/user/${userId}`,
        { password },
      )
      .then(({ data }) => data);
  }

  deleteUser(projectId, engine, databaseId, userId) {
    return this.$http.delete(
      `/cloud/project/${projectId}/database/${engine}/${databaseId}/user/${userId}`,
    );
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
        {},
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
    ).catch((error) => (error.status === 404 ? true : Promise.reject(error)));
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
}
