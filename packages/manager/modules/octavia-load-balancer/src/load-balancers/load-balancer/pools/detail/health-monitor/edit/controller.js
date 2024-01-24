export default class OctaviaLoadBalancerPoolsDetailHealthMonitorEditCtrl {
  /* @ngInject */
  constructor(Alerter, OctaviaLoadBalancerHealthMonitorService, $translate) {
    this.Alerter = Alerter;
    this.OctaviaLoadBalancerHealthMonitorService = OctaviaLoadBalancerHealthMonitorService;
    this.$translate = $translate;
  }
}
