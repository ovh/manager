import { PRIVATE_DATABASE_DATA_STREAMS_TRACKING_HITS } from './private-database-data-streams.constants';

export default class PrivateDatabasedataStreamsCtrl {
  /* @ngInject */
  constructor($stateParams) {
    this.$stateParams = $stateParams;
  }

  $onInit() {
    this.productId = this.$stateParams.productId;
    this.PRIVATE_DATABASE_DATA_STREAMS_TRACKING_HITS = PRIVATE_DATABASE_DATA_STREAMS_TRACKING_HITS;
    this.logSubscriptionApiData = {
      url: `/hosting/privateDatabase/${this.productId}/log/subscription`,
      params: {
        kind: this.kind,
      },
    };
  }
}
