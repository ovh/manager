import {
  LOAD_BALANCER_LOGS_SERVICE_GUIDE_LINK,
  LOAD_BALANCER_LOGS_TRACKING_HITS,
  LOAD_BALANCER_LOG_KINDS_KEYS,
} from './logs.constants';

export default class OctaviaLoadBalancerLogsController {
  /* @ngInject */
  constructor(coreConfig) {
    this.user = coreConfig.getUser();
  }

  $onInit() {
    this.LOAD_BALANCER_LOGS_TRACKING_HITS = LOAD_BALANCER_LOGS_TRACKING_HITS;
    this.logApiUrl = `/cloud/project/${this.projectId}/region/${this.region}/loadbalancing/loadbalancer/${this.loadbalancerId}/log/url`;
    this.logSubscriptionUrl = `/cloud/project/${this.projectId}/region/${this.region}/loadbalancing/loadbalancer/${this.loadbalancerId}/log/subscription`;
    this.logServiceGuideLink =
      LOAD_BALANCER_LOGS_SERVICE_GUIDE_LINK[this.user.ovhSubsidiary] ||
      LOAD_BALANCER_LOGS_SERVICE_GUIDE_LINK.DEFAULT;
    this.logKindsKeys = LOAD_BALANCER_LOG_KINDS_KEYS;
  }
}
