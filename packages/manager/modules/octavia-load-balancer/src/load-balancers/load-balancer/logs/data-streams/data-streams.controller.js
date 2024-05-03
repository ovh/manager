import { LOAD_BALANCER_DATA_STREAMS_TRACKING_HITS } from './data-streams.constants';

export default class dataStreamsCtrl {
  $onInit() {
    this.LOAD_BALANCER_DATA_STREAMS_TRACKING_HITS = LOAD_BALANCER_DATA_STREAMS_TRACKING_HITS;
    this.logSubscriptionApiData = {
      url: `/cloud/project/${this.projectId}/region/${this.region}/loadbalancing/loadbalancer/${this.loadbalancerId}/log/subscription`,
      params: {
        kind: this.kind,
      },
    };
  }
}
