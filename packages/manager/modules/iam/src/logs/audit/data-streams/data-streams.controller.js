import { IAM_DATA_STREAMS_TRACKING_HITS } from './data-streams.constants';
import { URL } from '../../logs.service';

export default class AuditLogsDataStreamsCtrl {
  $onInit() {
    this.IAM_DATA_STREAMS_TRACKING_HITS = IAM_DATA_STREAMS_TRACKING_HITS;
    this.logSubscriptionApiData = {
      url: URL.LOG_SUSBSCRIPTION,
      params: {
        kind: this.kind,
      },
    };
  }
}
