import { LOGS_INFO, LOAD_BALANCER_LOGS_TRACKING_HITS } from './logs.constants';

export default class OctaviaLoadBalancerLogsController {
  /* @ngInject */
  constructor($state) {
    this.$state = $state;
  }

  $onInit() {
    this.LOAD_BALANCER_LOGS_TRACKING_HITS = LOAD_BALANCER_LOGS_TRACKING_HITS;
    this.logApiUrl = `/cloud/project/${this.projectId}/region/${this.region}/loadbalancing/loadbalancer/${this.loadbalancerId}/log/url`;
    this.logSubscriptionUrl = `/cloud/project/${this.projectId}/region/${this.region}/loadbalancing/loadbalancer/${this.loadbalancerId}/log/subscription`;
    this.logServiceGuideLink = LOGS_INFO.DEFAULT;
  }
}
