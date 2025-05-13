export default class IpLoadBalancerZoneService {
  /* @ngInject */
  constructor($translate, OvhApiIpLoadBalancing, ovhManagerRegionService) {
    this.$translate = $translate;
    this.IpLoadBalancing = OvhApiIpLoadBalancing;
    this.ovhManagerRegionService = ovhManagerRegionService;
  }

  getIPLBZones(serviceName) {
    return this.IpLoadBalancing.Zone()
      .v6()
      .query({
        serviceName,
      })
      .$promise.then((zones) =>
        zones.map((zone) => ({
          id: zone,
          name: this.ovhManagerRegionService.getRegion(zone).microRegion.text,
        })),
      );
  }

  getZonesSelectData(serviceName) {
    return this.getIPLBZones(serviceName).then((iplbZones) => {
      iplbZones.push({
        id: 'all',
        name: this.$translate.instant('iplb_zone_all'),
      });

      return iplbZones;
    });
  }

  humanizeZone(zone) {
    return this.ovhManagerRegionService.getRegion(zone).microRegion.text;
  }
}
