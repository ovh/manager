import { HORIZON_LINK } from './constants';

export default class OctaviaLoadBalancerPoolsDetailHealthMonitorCreateCtrl {
  /* @ngInject */

  constructor(Alerter, OctaviaLoadBalancerHealthMonitorService, $translate) {
    this.Alerter = Alerter;
    this.OctaviaLoadBalancerHealthMonitorService = OctaviaLoadBalancerHealthMonitorService;
    this.$translate = $translate;
    this.HORIZON_LINK = HORIZON_LINK;
  }
}
