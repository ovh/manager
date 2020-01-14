import forEach from 'lodash/forEach';
import get from 'lodash/get';
import set from 'lodash/set';

export default class IpLoadBalancerServerFarmCtrl {
  /* @ngInject */
  constructor($filter, $state, $translate, CucControllerHelper,
    IpLoadBalancerServerService,
    IpLoadBalancerServerFarmService) {
    this.$filter = $filter;
    this.$state = $state;
    this.$translate = $translate;
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerServerService = IpLoadBalancerServerService;
    this.IpLoadBalancerServerFarmService = IpLoadBalancerServerFarmService;

    this.initLoaders();
  }

  $onInit() {
    this.i18n = {
      preview: this.$translate.instant('iplb_preview_see'),
      update: this.$translate.instant('iplb_modify'),
      remove: this.$translate.instant('delete'),
    };

    this.init();
  }

  init() {
    this.farms.load();
  }

  initLoaders() {
    this.farms = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.IpLoadBalancerServerFarmService.getServerFarms(
          this.serviceName,
        ).then((farms) => {
          this.createFarmActions(farms);
          return farms;
        }),
      successHandler: () => this.loadServers(),
    });
  }

  loadServers() {
    forEach(this.farms.data, (farm) => {
      set(
        farm,
        'servers',
        this.CucControllerHelper.request.getArrayLoader({
          loaderFunction: () =>
            this.IpLoadBalancerServerFarmService.getServerFarmServers(
              this.serviceName,
              farm.farmId,
              farm.type,
            ),
        }),
      );
      farm.servers.load();
    });
  }

  toggle(farm, server) {
    const newStatus = server.status === 'active' ? 'inactive' : 'active';
    this.IpLoadBalancerServerService.update(
      farm.type,
      this.serviceName,
      farm.farmId,
      server.serverId,
      {
        status: newStatus,
      },
    ).then(() => {
      // Apply value on model
      set(server, 'status', newStatus);
    });
  }

  createFarmActions(farms) {
    this.farmActions = {};
    farms.forEach((farm) => {
      this.farmActions[farm.farmId] = [
        [{
          text: this.i18n.preview,
          callback: () => this.goToIplbServerFarmPreview(farm),
        }],
        [{
          text: this.i18n.update,
          callback: () => this.goToIplbServerFarmUpdate(farm.farmId),
        }, {
          text: this.i18n.remove,
          callback: () => this.goToIplbServerFarmDelete(farm),
        }],
      ];
    });
  }

  getFarmText(farm) {
    let serverText = '';
    if (!get(farm.servers, 'loading', false)) {
      const serverNumber = farm.servers.data.length;
      const serverLabel =
        serverNumber > 1
          ? this.$translate.instant(
              'iplb_farm_list_accordion_aside_server_many',
              { serverNumber },
            )
          : this.$translate.instant(
              'iplb_farm_list_accordion_aside_server_single',
              { serverNumber },
            );
      serverText = ` / ${this.$translate.instant(serverLabel, {
        serverNumber,
      })}`;
    }

    let zone = farm.zoneText.microRegion.text;
    if (farm.zone === 'all') {
      zone = this.$translate.instant('iplb_zone_all');
    }

    return `${this.$filter('uppercase')(farm.type) +
      (farm.port ? `:${farm.port}` : '')} / ${zone}${serverText}`;
  }

  getFarmName(farm) {
    if (!farm.displayName) {
      return this.$translate.instant('iplb_farm_list_accordion_title', {
        farmId: farm.farmId,
      });
    }

    return `${farm.displayName} (${farm.farmId})`;
  }
}
