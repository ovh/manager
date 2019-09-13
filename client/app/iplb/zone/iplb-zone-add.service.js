class IpLoadBalancerZoneAddService {
  constructor($q, $translate, $window, CucCloudMessage, CucOrderHelperService,
    OvhApiIpLoadBalancing, CucRegionService, CucServiceHelper) {
    this.$q = $q;
    this.$translate = $translate;
    this.$window = $window;
    this.CucCloudMessage = CucCloudMessage;
    this.CucOrderHelperService = CucOrderHelperService;
    this.OvhApiIpLoadBalancing = OvhApiIpLoadBalancing;
    this.CucRegionService = CucRegionService;
    this.CucServiceHelper = CucServiceHelper;
  }

  getOrderableZones(serviceName) {
    return this.$q.all({
      orderableZones: this.OvhApiIpLoadBalancing.v6()
        .get({ serviceName })
        .$promise
        .then(response => response.orderableZone),
      suspendedZones: this.getSuspendedZones(serviceName),
    })
      .then((response) => {
        const availableZones = response.orderableZones.concat(response.suspendedZones);
        return _.map(
          availableZones,
          zone => _.extend(zone, this.CucRegionService.getRegion(zone.name)),
        );
      })
      .then(availableZones => _.map(availableZones, zone => _.extend(zone, {
        selectable: {
          value: true,
          reason: zone.state === 'released' ? this.$translate.instant('iplb_zone_add_available_released') : '',
        },
      })))
      .catch(this.CucServiceHelper.errorHandler('iplb_zone_add_loading_error'));
  }

  addZones(serviceName, zones) {
    if (zones.length === 0) {
      return this.CucServiceHelper.errorHandler('iplb_zone_add_selection_error')({});
    }

    return this.$q.all({
      created: this.createZones(serviceName, _.filter(zones, zone => zone.state !== 'released')),
      activated: this.activateZones(serviceName, _.filter(zones, zone => zone.state === 'released')),
    })
      .then((response) => {
        if (response.created.quantity > 0) {
          this.$window.open(response.created.url, '_blank');
          return this.CucServiceHelper.successHandler({
            text: this.$translate.instant(zones.length > 1 ? 'iplb_zone_add_plural_success' : 'iplb_zone_add_single_success'),
            link: {
              text: this.$translate.instant('common_complete_order'),
              value: response.created.url,
            },
          })(response);
        }

        if (response.activated.quantity > 0) {
          return this.CucServiceHelper.successHandler({
            text: this.$translate.instant(zones.length > 1 ? 'iplb_zone_activate_plural_success' : 'iplb_zone_activate_single_success'),
          })(response);
        }

        return this.$q.reject();
      });
  }

  createZones(serviceName, zones) {
    const emptyResponse = this.$q.when({ quantity: 0 });
    if (!zones.length) {
      return emptyResponse;
    }

    return this.CucOrderHelperService.getExpressOrderUrl(_.map(zones, zone => ({
      productId: 'ipLoadbalancing',
      serviceName,
      planCode: zone.planCode,
    })))
      .then(response => ({
        quantity: zones.length,
        url: response,
      }))
      .catch((response) => {
        this.CucServiceHelper.errorHandler(zones.length > 1 ? 'iplb_zone_add_plural_error' : 'iplb_zone_add_single_error')(response);
        return emptyResponse;
      });
  }

  activateZones(serviceName, zones) {
    const emptyResponse = this.$q.when({ quantity: 0 });
    if (!zones.length) {
      return emptyResponse;
    }

    const promises = _.map(
      zones,
      zone => this.OvhApiIpLoadBalancing.Zone().v6()
        .cancelDelete({ serviceName, name: zone.name }, {}).$promise,
    );
    return this.$q.all(promises)
      .then(() => ({
        quantity: zones.length,
      }))
      .catch((response) => {
        this.CucServiceHelper.errorHandler(zones.length > 1 ? 'iplb_zone_add_plural_error' : 'iplb_zone_add_single_error')(response);
        return emptyResponse;
      });
  }

  getSuspendedZones(serviceName) {
    return this.OvhApiIpLoadBalancing.Zone().v6().query({ serviceName })
      .$promise
      .then((zoneIds) => {
        const promises = _.map(
          zoneIds,
          zoneId => this.OvhApiIpLoadBalancing.Zone().v6()
            .get({ serviceName, name: zoneId }).$promise,
        );
        return this.$q.all(promises);
      })
      .then(zones => _.filter(zones, zone => zone.state === 'released'));
  }
}

angular.module('managerApp').service('IpLoadBalancerZoneAddService', IpLoadBalancerZoneAddService);
