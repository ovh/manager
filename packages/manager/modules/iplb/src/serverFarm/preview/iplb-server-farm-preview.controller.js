export default class IpLoadBalancerServerFarmPreviewCtrl {
  /* @ngInject */
  constructor($uibModalInstance, IpLoadBalancerServerFarmService, IpLoadBalancerZoneService, farm) {
    this.$uibModalInstance = $uibModalInstance;
    this.IpLoadBalancerServerFarmService = IpLoadBalancerServerFarmService;
    this.IpLoadBalancerZoneService = IpLoadBalancerZoneService;
    this.farm = farm;
  }

  getZone() {
    return this.IpLoadBalancerZoneService.humanizeZone(this.farm.zone);
  }

  getBalance() {
    return this.IpLoadBalancerServerFarmService.humanizeBalance(this.farm.balance);
  }

  getStickiness() {
    return this.IpLoadBalancerServerFarmService.humanizeStickiness(this.farm.stickiness);
  }

  dismiss() {
    this.$uibModalInstance.dismiss();
  }
}
