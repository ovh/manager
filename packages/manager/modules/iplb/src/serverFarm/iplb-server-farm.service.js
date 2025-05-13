import map from 'lodash/map';
import set from 'lodash/set';

export default class IpLoadBalancerServerFarmService {
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

    this.Farm = {
      all: this.IpLoadBalancing.Farm().v6(),
      tcp: this.IpLoadBalancing.Farm()
        .Tcp()
        .v6(),
      udp: this.IpLoadBalancing.Farm()
        .Udp()
        .v6(),
      http: this.IpLoadBalancing.Farm()
        .Http()
        .v6(),
    };

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

  getAvailableFarmProbes(serviceName) {
    return this.IpLoadBalancing.v6()
      .availableFarmProbes({ serviceName })
      .$promise.catch(
        this.CucServiceHelper.errorHandler('iplb_farm_edit_probe_info_error'),
      );
  }

  getServerFarms(serviceName, networkId) {
    return this.Farm.all
      .query({ serviceName, vrackNetworkId: networkId })
      .$promise.then((farms) => {
        const promises = map(farms, (farm) =>
          this.getServerFarm(serviceName, farm.id, farm.type),
        );
        return this.$q.all(promises);
      })
      .catch(
        this.CucServiceHelper.errorHandler('iplb_farm_list_loading_error'),
      );
  }

  getServerFarm(serviceName, farmId, type) {
    return this.Farm[type]
      .get({ serviceName }, { farmId })
      .$promise.then((farm) => {
        set(farm, 'type', type);
        set(
          farm,
          'zoneText',
          this.ovhManagerRegionService.getRegion(farm.zone),
        );
        return farm;
      });
  }

  getAllFarmsTypes(serviceName) {
    return this.Farm.all.query({ serviceName }).$promise;
  }

  getServerFarmServers(serviceName, farmId, type) {
    return this.Server[type]
      .query({ serviceName, farmId })
      .$promise.then((serverIds) => {
        const promises = map(serverIds, (serverId) =>
          this.Server[type]
            .get({ serviceName, farmId, serverId })
            .$promise.then((server) => {
              if (!server.serverState) {
                set(server, 'serverState', []);
              }
              return server;
            }),
        );
        return this.$q.all(promises);
      })
      .catch(
        this.CucServiceHelper.errorHandler(
          'iplb_farm_server_list_loading_error',
        ),
      );
  }

  create(type, serviceName, farm) {
    return this.Farm[type]
      .post({ serviceName }, farm)
      .$promise.then(() =>
        this.CucServiceHelper.successHandler('iplb_farm_add_success')(),
      )
      .then(() => this.Farm.all.resetQueryCache())
      .then(() => this.IpLoadBalancerConfigurationService.showRefreshWarning())
      .catch(this.CucServiceHelper.errorHandler('iplb_farm_add_error'));
  }

  update(type, serviceName, farmId, farm) {
    return this.Farm[type]
      .put(
        {
          serviceName,
          farmId,
        },
        farm,
      )
      .$promise.then(() =>
        this.CucServiceHelper.successHandler('iplb_farm_update_success')(),
      )
      .then(() => this.Farm.all.resetQueryCache())
      .then(() => this.IpLoadBalancerConfigurationService.showRefreshWarning())
      .catch(this.CucServiceHelper.errorHandler('iplb_farm_update_error'));
  }

  delete(type, serviceName, farmId) {
    return this.Farm[type]
      .delete({
        serviceName,
        farmId,
      })
      .$promise.then(() =>
        this.CucServiceHelper.successHandler('iplb_farm_delete_success')(),
      )
      .then(() => this.Farm.all.resetQueryCache())
      .then(() => this.IpLoadBalancerConfigurationService.showRefreshWarning())
      .catch(this.CucServiceHelper.errorHandler('iplb_farm_delete_error'));
  }

  humanizeBalance(balance) {
    if (!balance) {
      return '-';
    }

    return this.$translate.instant(`iplb_farm_balance_${balance}`);
  }

  humanizeStickiness(stickiness) {
    if (!stickiness) {
      return this.$translate.instant('iplb_farm_stickiness_none');
    }

    return this.$translate.instant(`iplb_farm_stickiness_${stickiness}`);
  }
}
