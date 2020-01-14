export default class IpLoadBalancerServerFarmPreviewCtrl {
  /* @ngInject */
  constructor(IpLoadBalancerServerFarmService, IpLoadBalancerZoneService) {
    this.IpLoadBalancerServerFarmService = IpLoadBalancerServerFarmService;
    this.IpLoadBalancerZoneService = IpLoadBalancerZoneService;
  }

  getZone() {
    return this.IpLoadBalancerZoneService.humanizeZone(this.farm.zone);
  }

  getBalance() {
    return this.IpLoadBalancerServerFarmService.humanizeBalance(
      this.farm.balance,
    );
  }

  getStickiness() {
    return this.IpLoadBalancerServerFarmService.humanizeStickiness(
      this.farm.stickiness,
    );
  }
}
