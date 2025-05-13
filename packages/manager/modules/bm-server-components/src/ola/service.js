import Ola from './ola.class';

export default class OlaService {
  /* @ngInject */
  constructor(
    $http,
    $q,
    Poller,
    coreConfig,
    olaConstants,
    OvhApiOrderCartServiceOption,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.Poller = Poller;
    this.coreConfig = coreConfig;
    this.olaConstants = olaConstants;
    this.OvhApiOrderCartServiceOption = OvhApiOrderCartServiceOption;
  }

  computeOlaData(resources) {
    const ola = new Ola(resources);
    ola.constants = this.olaConstants;
    return ola;
  }

  setPrivateAggregation(serverName, name, interfacesToGroup) {
    return this.$http
      .post(`/dedicated/server/${serverName}/ola/aggregation`, {
        name,
        virtualNetworkInterfaces: interfacesToGroup.map(({ id }) => id),
      })
      .then((task) => this.waitForTask(serverName, task.data.taskId));
  }

  setDefaultInterfaces(serverName, interfaceToUngroup) {
    return this.$http
      .post(`/dedicated/server/${serverName}/ola/reset`, {
        virtualNetworkInterface: interfaceToUngroup.id,
      })
      .then((task) => this.waitForTask(serverName, task.data.taskId));
  }

  waitForTask(serverName, taskId) {
    return this.Poller.poll(
      `/dedicated/server/${serverName}/task/${taskId}`,
      {},
      {
        namespace: 'dedicated.server.interfaces.ola.aggregation',
        method: 'get',
        successRule: {
          status: 'done',
        },
        errorRule: (task) => {
          return task.status === 'ovhError' || task.status === 'customerError';
        },
      },
    )
      .then(() => true)
      .catch((error) => (error.status === 404 ? true : Promise.reject(error)));
  }

  resetOlaInterfaces(serverName, olaInterfaces) {
    return this.$q
      .all(
        olaInterfaces.map(({ id }) =>
          this.$http
            .post(`/dedicated/server/${serverName}/ola/reset`, {
              virtualNetworkInterface: id,
            })
            .then(({ data }) => data),
        ),
      )
      .then((tasks) => this.waitAllTasks(serverName, tasks));
  }

  getTasks(serverName) {
    return this.$http
      .get(`/dedicated/server/${serverName}/task`, {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': 5000,
          'X-Pagination-Filter': `function:in=${this.olaConstants.INTERFACE_TASK},${this.olaConstants.INTERFACE_GROUP_TASK},${this.olaConstants.INTERFACE_UNGROUP_TASK}`,
        },
      })
      .then(({ data }) => data);
  }

  waitTasks(serverName) {
    return this.getTasks(serverName).then((tasks) =>
      this.waitAllTasks(serverName, tasks),
    );
  }

  waitAllTasks(serverName, tasks) {
    return this.$q.all(
      tasks.map((task) =>
        this.Poller.poll(
          `/dedicated/server/${serverName}/task/${task.taskId}`,
          null,
          { namespace: 'dedicated.server.interfaces.ola', method: 'get' },
        ),
      ),
    );
  }

  // TODO unused ?
  terminateOla(serverName) {
    return this.$http.delete(`/dedicated/server/${serverName}/option/OLA`).then(
      (response) => response.data,
      (error) => {
        throw error;
      },
    );
  }
}
