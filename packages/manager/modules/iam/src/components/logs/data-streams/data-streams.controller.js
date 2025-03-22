import { IAM_DATA_STREAMS_TRACKING_HITS } from '../../../logs/logs.constants';

export default class LogsDataStreamsCtrl {
  $onInit() {
    this.trackingHits = IAM_DATA_STREAMS_TRACKING_HITS;
    this.logSubscriptionApiData = {
      url: this.url,
      params: {
        kind: this.kind,
      },
    };
  }
}
