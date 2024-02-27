import {
  PROTOCOLS,
  PROTOCOLS_PORT,
  LISTENER_POOL_PROTOCOL_COMBINATION,
} from './constants';

export default class OctaviaLoadBalancerListenerFormCtrl {
  constructor() {
    this.PROTOCOLS = PROTOCOLS;
  }

  $onInit() {
    this.filteredPools = this.filterPools();
    this.protocols = Object.values(PROTOCOLS);
  }

  onProtocolChange() {
    this.model.port = PROTOCOLS_PORT[this.model.protocol];
    this.filteredPools = this.filterPools();
    if (
      (this.model.pool &&
        !this.filteredPools.find((pool) => pool.id === this.model.pool.id)) ||
      this.model.protocol === this.PROTOCOLS.PROMETHEUS
    ) {
      this.model.pool = null;
    }
  }

  filterPools() {
    if (!this.model.protocol) {
      return this.pools;
    }
    return this.pools.filter(
      (pool) =>
        !pool.listenerId &&
        LISTENER_POOL_PROTOCOL_COMBINATION[this.model.protocol].includes(
          pool.protocol,
        ),
    );
  }
}
