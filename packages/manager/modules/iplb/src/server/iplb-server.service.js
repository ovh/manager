import find from 'lodash/find';

export default class IpLoadBalancerServerService {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    IpLoadBalancerConfigurationService,
    OvhApiIpLoadBalancing,
    CucServiceHelper,
    ovhManagerRegionService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.IpLoadBalancerConfigurationService = IpLoadBalancerConfigurationService;
    this.IpLoadBalancing = OvhApiIpLoadBalancing;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.CucServiceHelper = CucServiceHelper;

    this.Server = {
      tcp: this.IpLoadBalancing.Farm()
        .Tcp()
        .Server()
        .v6(),
      udp: this.IpLoadBalancing.Farm()
        .Udp()
        .Server()
        .v6(),
      http: this.IpLoadBalancing.Farm()
        .Http()
        .Server()
        .v6(),
    };
  }

  getServer(serviceName, farmId, serverId) {
    return this.getFarmType(serviceName, farmId).then(
      (type) =>
        this.Server[type].get({
          serviceName,
          farmId,
          serverId,
        }).$promise,
    );
  }

  create(type, serviceName, farmId, server) {
    return this.Server[type]
      .post(
        {
          serviceName,
          farmId,
        },
        server,
      )
      .$promise.then(() =>
        this.CucServiceHelper.successHandler('iplb_server_add_success')(),
      )
      .then(() => this.IpLoadBalancerConfigurationService.showRefreshWarning())
      .catch(this.CucServiceHelper.errorHandler('iplb_server_add_error'));
  }

  update(type, serviceName, farmId, serverId, server) {
    return this.Server[type]
      .put(
        {
          serviceName,
          farmId,
          serverId,
        },
        server,
      )
      .$promise.then(() =>
        this.CucServiceHelper.successHandler('iplb_server_update_success')(),
      )
      .then(() => this.IpLoadBalancerConfigurationService.showRefreshWarning())
      .catch(this.CucServiceHelper.errorHandler('iplb_server_update_error'));
  }

  delete(serviceName, farmId, serverId) {
    return this.getFarmType(serviceName, farmId)
      .then(
        (type) =>
          this.Server[type].delete({
            serviceName,
            farmId,
            serverId,
          }).$promise,
      )
      .then(() =>
        this.CucServiceHelper.successHandler('iplb_server_delete_success')(),
      )
      .then(() => this.IpLoadBalancerConfigurationService.showRefreshWarning())
      .catch(this.CucServiceHelper.errorHandler('iplb_server_delete_error'));
  }

  getFarmType(serviceName, farmId) {
    return this.IpLoadBalancing.Farm()
      .v6()
      .query({ serviceName })
      .$promise.then((farms) => {
        const farm = find(farms, { id: parseInt(farmId, 10) });
        return farm;
      })
      .then((farm) => {
        if (!farm) {
          return this.$q.reject('NOTFOUND');
        }
        return farm.type;
      });
  }

  getProxyProtocolVersions() {
    return this.IpLoadBalancing.v6()
      .schema()
      .$promise.then(
        (schema) =>
          schema.models['ipLoadbalancing.ProxyProtocolVersionEnum'].enum,
      )
      .catch(this.CucServiceHelper.errorHandler('iplb_server_request_error'));
  }
}
