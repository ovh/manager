import filter from 'lodash/filter';
import includes from 'lodash/includes';
import isString from 'lodash/isString';
import map from 'lodash/map';
import flatMap from 'lodash/flatMap';
import some from 'lodash/some';
import uniq from 'lodash/uniq';

import Interface from './interface.class';
import { VIRTUAL_TYPE, GUIDES } from './interfaces.constants';

export default class DedicatedServerInterfacesService {
  /* @ngInject */
  constructor(
    $q,
    coreConfig,
    OvhApiDedicatedServerPhysicalInterface,
    OvhApiDedicatedServerVirtualInterface,
  ) {
    this.$q = $q;
    this.coreConfig = coreConfig;
    this.PhysicalInterface = OvhApiDedicatedServerPhysicalInterface;
    this.VirtualInterface = OvhApiDedicatedServerVirtualInterface;
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

  getInterfaces(serverName, specifications) {
    if (
      specifications.constructor === Object &&
      Object.keys(specifications).length === 0
    )
      return [];

    let nics;
    this.typeVrack = specifications.vrack.type;

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
        ...flatMap(
          vnis,
          ({
            uuid,
            name,
            networkInterfaceController,
            mode: type,
            vrack,
            enabled,
          }) =>
            !(!this.typeVrack && type === VIRTUAL_TYPE.vrack)
              ? new Interface({
                  id: uuid,
                  name,
                  mac: networkInterfaceController.join(', '),
                  type,
                  vrack,
                  enabled,
                })
              : [],
        ),
      ]);
  }

  /**
   * provide guide URL for given subsidiary
   * @return {string}
   */
  getGuideUrl() {
    const { ovhSubsidiary } = this.coreConfig.getUser();
    return GUIDES[ovhSubsidiary] || GUIDES.DEFAULT;
  }
}
