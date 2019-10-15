import _ from 'lodash';
import Interface from './interface.class';
import { INTERFACE_TASK, OLA_PLAN_CODE } from './interfaces.constants';

export default class DedicatedServerInterfacesService {
  /* @ngInject */
  constructor(
    $http,
    $q,
    OvhApiDedicatedServerOla,
    OvhApiDedicatedServerPhysicalInterface,
    OvhApiDedicatedServerVirtualInterface,
    OvhApiOrderCartServiceOption,
    Poller,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.Ola = OvhApiDedicatedServerOla;
    this.PhysicalInterface = OvhApiDedicatedServerPhysicalInterface;
    this.VirtualInterface = OvhApiDedicatedServerVirtualInterface;
    this.OvhApiOrderCartServiceOption = OvhApiOrderCartServiceOption;
    this.Poller = Poller;
  }

  getNetworkInterfaceControllers(serverName) {
    return this.PhysicalInterface
      .v6()
      .query({ serverName })
      .$promise
      .then(macs => this.$q.all(
        macs.map(mac => this.PhysicalInterface.v6().get({ serverName, mac }).$promise),
      ));
  }

  getVirtualNetworkInterfaces(
    nics,
    serverName,
  ) {
    const vniUUids = _.uniq(
      _.map(
        nics.filter(
          ({ virtualNetworkInterface }) => _.isString(virtualNetworkInterface),
        ),
        'virtualNetworkInterface',
      ),
    );

    return this.$q.all(
      _.map(
        vniUUids,
        uuid => this.VirtualInterface
          .v6()
          .get({
            serverName,
            uuid,
          })
          .$promise,
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
      .then(vnis => [
        ..._.map(
          _.filter(
            nics,
            ({ mac }) => !_.some(
              vnis,
              ({ networkInterfaceController }) => _.includes(networkInterfaceController, mac),
            ),
          ),
          ({ mac, linkType: type }) => new Interface({
            id: mac,
            name: mac,
            mac,
            type,
            vrack: null,
            enabled: true, // physical interface is always enabled
          }),
        ),
        ..._.map(
          vnis,
          ({
            uuid, name, networkInterfaceController, mode: type, vrack, enabled,
          }) => new Interface({
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
    return this.$http.get(`/dedicated/server/${serverName}/task?function=${INTERFACE_TASK}`)
      .then(response => response.data, () => [])
      .then(taskIds => ({
        promise: this.waitAllTasks(serverName, taskIds.map(taskId => ({ taskId }))),
      }));
  }

  disableInterfaces(serverName, interfaces) {
    return this.$q.all(
      interfaces
        .filter(i => i.enabled === true)
        .map(i => this.VirtualInterface.v6().disable({
          serverName,
          uuid: i.id,
        }, {}).$promise),
    ).then(tasks => this.waitAllTasks(serverName, tasks));
  }

  setPrivateAggregation(serverName, name, interfacesToGroup) {
    return this.Ola.v6().group({ serverName }, {
      name,
      virtualNetworkInterfaces: _.map(interfacesToGroup, 'id'),
    }).$promise;
  }

  setDefaultInterfaces(serverName, interfaceToUngroup) {
    return this.Ola.v6().ungroup({ serverName }, {
      virtualNetworkInterface: interfaceToUngroup.id,
    }).$promise;
  }

  waitAllTasks(serverName, tasks) {
    return this.$q.all(tasks.map(task => this.Poller.poll(
      `/dedicated/server/${serverName}/task/${task.taskId}`,
      null,
      { namespace: 'dedicated.server.interfaces.ola', method: 'get' },
    )));
  }

  terminateOla(serverName) {
    return this.$http.delete(`/dedicated/server/${serverName}/option/OLA`)
      .then(
        response => response.data,
        (error) => { throw error; },
      );
  }

  getOlaPrice(serviceName) {
    return this.OvhApiOrderCartServiceOption.v6().get({
      productName: 'baremetalServers',
      serviceName,
    }).$promise
      .then((options) => {
        const prices = _.get(
          _.find(options, {
            planCode: OLA_PLAN_CODE,
          }), 'prices',
        );
        return _.get(_.find(prices, { pricingMode: 'default' }), 'price');
      });
  }
}
