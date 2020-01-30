export default class IpLoadBalancerZoneService {
  /* @ngInject */
  constructor($translate, OvhApiIpLoadBalancing, CucRegionService) {
    this.$translate = $translate;
    this.IpLoadBalancing = OvhApiIpLoadBalancing;
    this.CucRegionService = CucRegionService;
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
          name: this.CucRegionService.getRegion(zone).microRegion.text,
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
    return this.CucRegionService.getRegion(zone).microRegion.text;
  }
}
