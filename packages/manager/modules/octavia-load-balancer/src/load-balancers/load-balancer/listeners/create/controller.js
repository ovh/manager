import {
  PROTOCOLS,
  PROTOCOLS_PORT,
  LISTENER_POOL_PROTOCOL_COMBINATION,
} from './constants';

export default class OctaviaLoadBalancerListenersCtrl {
  /* @ngInject */
  constructor(OctaviaLoadBalancerListenersService, Alerter, $translate) {
    this.OctaviaLoadBalancerListenersService = OctaviaLoadBalancerListenersService;
    this.Alerter = Alerter;
    this.$translate = $translate;
    this.PROTOCOLS = PROTOCOLS;
  }

  $onInit() {
    this.loading = false;
    this.model = {
      loadbalancerId: this.loadbalancerId,
      name: '',
      port: null,
      protocol: null,
      pool: null,
    };
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
      this.model.defaultPoolId = null;
    }
  }

  filterPools() {
    if (!this.model.protocol) {
      return this.pools;
    }
    return this.pools.filter((pool) =>
      LISTENER_POOL_PROTOCOL_COMBINATION[this.model.protocol].includes(
        pool.protocol,
      ),
    );
  }

  submit() {
    this.loading = true;
    this.trackAction('::confirm');
    this.OctaviaLoadBalancerListenersService.createListener(
      this.projectId,
      this.region,
      this.model.loadbalancerId,
      this.model.name,
      this.model.protocol,
      this.model.port,
      this.model.pool?.id,
    )
      .then(async () => {
        this.trackAction('-success');
        this.Alerter.set(
          'alert-success',
          this.$translate.instant(
            'octavia_load_balancer_listeners_create_success',
          ),
          null,
          'octavia.alerts.global',
        );
        await this.goBack(true);
      })
      .catch((error) => {
        this.trackAction('-error');
        this.Alerter.error(
          this.$translate.instant('octavia_load_balancer_global_error', {
            message: error.data?.message,
            requestId: error.config?.headers['X-OVH-MANAGER-REQUEST-ID'],
          }),
          'octavia.alerts.global',
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  cancel() {
    this.trackAction('::cancel');
    this.goBack();
  }
}
