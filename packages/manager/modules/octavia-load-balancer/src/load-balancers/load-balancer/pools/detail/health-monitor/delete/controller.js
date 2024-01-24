export default class OctaviaLoadBalancerPoolsDetailHealthMonitorDeleteCtrl {
  /* @ngInject */
  constructor(Alerter, OctaviaLoadBalancerHealthMonitorService, $translate) {
    this.Alerter = Alerter;
    this.OctaviaLoadBalancerHealthMonitorService = OctaviaLoadBalancerHealthMonitorService;
    this.$translate = $translate;
  }
}
