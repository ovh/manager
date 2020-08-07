import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import includes from 'lodash/includes';
import isString from 'lodash/isString';
import map from 'lodash/map';
import startsWith from 'lodash/startsWith';
import some from 'lodash/some';
import uniq from 'lodash/uniq';

import Interface from './interface.class';
import { INTERFACE_TASK, OLA_PLAN_CODE } from './interfaces.constants';

export default class DedicatedServerInterfacesService {
  /* @ngInject */
  constructor(
    $http,
    $q,
    coreConfig,
    OvhApiDedicatedServerOla,
    OvhApiDedicatedServerPhysicalInterface,
    OvhApiDedicatedServerVirtualInterface,
    OvhApiOrderCartServiceOption,
    Poller,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.coreConfig = coreConfig;
    this.Ola = OvhApiDedicatedServerOla;
    this.PhysicalInterface = OvhApiDedicatedServerPhysicalInterface;
    this.VirtualInterface = OvhApiDedicatedServerVirtualInterface;
    this.OvhApiOrderCartServiceOption = OvhApiOrderCartServiceOption;
    this.Poller = Poller;
  }

  getNetworkInterfaceControllers(serverName) {
    return this.PhysicalInterface.v6()
      .query({ serverName })
      .$promise.then((macs) =>
        this.$q.all(
          macs.map(
            (mac) =>
              this.PhysicalInterface.v6().get({ serverName, mac }).$promise,
          ),
        ),
      )
      .catch((err) => {
        if (err.status === 460) {
          return [];
        }

        return this.$q.reject(err);
      });
  }

  getVirtualNetworkInterfaces(nics, serverName) {
    const vniUUids = uniq(
      map(
        nics.filter(({ virtualNetworkInterface }) =>
          isString(virtualNetworkInterface),
        ),
        'virtualNetworkInterface',
      ),
    );

    return this.$q.all(
      map(
        vniUUids,
        (uuid) =>
          this.VirtualInterface.v6().get({
            serverName,
            uuid,
          }).$promise,
      ),
    );
  }

  getInterfaces(serverName) {
    let nics;

    return this.getNetworkInterfaceControllers(serverName)
      .then((results) => {
        nics = [...results];

        return this.getVirtualNetworkInterfaces(nics, serverName);
      })
      .then((vnis) => [
        ...map(
          filter(
            nics,
            ({ mac }) =>
              !some(vnis, ({ networkInterfaceController }) =>
                includes(networkInterfaceController, mac),
              ),
          ),
          ({ mac, linkType: type }) =>
            new Interface({
              id: mac,
              name: mac,
              mac,
              type,
              vrack: null,
              enabled: true, // physical interface is always enabled
            }),
        ),
        ...map(
          vnis,
          ({
            uuid,
            name,
            networkInterfaceController,
            mode: type,
            vrack,
            enabled,
          }) =>
            new Interface({
              id: uuid,
              name,
              mac: networkInterfaceController.join(', '),
              type,
              vrack,
              enabled,
            }),
        ),
      ]);
  }

  getTasks(serverName) {
    return this.$http
      .get(`/dedicated/server/${serverName}/task?function=${INTERFACE_TASK}`)
      .then(
        (response) => response.data,
        () => [],
      )
      .then((taskIds) => ({
        promise: this.waitAllTasks(
          serverName,
          taskIds.map((taskId) => ({ taskId })),
        ),
      }));
  }

  setPrivateAggregation(serverName, name, interfacesToGroup) {
    return this.$http.post(`/dedicated/server/${serverName}/ola/aggregation`, {
      name,
      virtualNetworkInterfaces: map(interfacesToGroup, 'id'),
    }).then((task) => this.waitForTask(serverName, task.data.taskId));
  }

  setDefaultInterfaces(serverName, interfaceToUngroup) {
    return this.$http.post(`/dedicated/server/${serverName}/ola/reset`, {
      virtualNetworkInterface: interfaceToUngroup.id,
    }).then((task) => this.waitForTask(serverName, task.data.taskId));
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
    ).then(
      () => true,
      (error) => {
        if (error.status === 404) {
          return true;
        }
        return Promise.reject(error);
      },
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

  terminateOla(serverName) {
    return this.$http.delete(`/dedicated/server/${serverName}/option/OLA`).then(
      (response) => response.data,
      (error) => {
        throw error;
      },
    );
  }

  getOlaPrice(serviceName, { datacenter }) {
    let suffix = 'eu';
    if (startsWith(datacenter, 'HIL') || startsWith(datacenter, 'VIN')) {
      suffix = 'us';
    }
    if (startsWith(datacenter, 'BHS')) {
      suffix = 'ca';
    }

    return this.OvhApiOrderCartServiceOption.v6()
      .get({
        productName: 'baremetalServers',
        serviceName,
      })
      .$promise.then((options) => {
        let planCode = OLA_PLAN_CODE;

        if (this.coreConfig.getRegion() === 'US') {
          planCode = `${OLA_PLAN_CODE}-${suffix}`;
        }

        const prices = get(
          find(options, {
            planCode,
          }),
          'prices',
        );
        return get(find(prices, { pricingMode: 'default' }), 'price');
      });
  }
}
