import {
  PRIVATE_DATABASE_LOGS_SERVICE_GUIDE_LINK,
  PRIVATE_DATABASE_LOGS_TRACKING_HITS,
  PRIVATE_DATABASE_LOGS_KINDS_KEYS,
} from './private-database-logs.constants';

export default class PrivateDatabaseLogsController {
  /* @ngInject */
  constructor(coreConfig, $stateParams) {
    this.user = coreConfig.getUser();
    this.$stateParams = $stateParams;
  }

  $onInit() {
    this.productId = this.$stateParams.productId;
    this.PRIVATE_DATABASE_LOGS_TRACKING_HITS = PRIVATE_DATABASE_LOGS_TRACKING_HITS;
    this.logApiUrl = `/hosting/privateDatabase/${this.productId}/log/url`;
    this.logSubscriptionUrl = `/hosting/privateDatabase/${this.productId}/log/subscription`;
    this.logServiceGuideLink =
      PRIVATE_DATABASE_LOGS_SERVICE_GUIDE_LINK[this.user.ovhSubsidiary] ||
      PRIVATE_DATABASE_LOGS_SERVICE_GUIDE_LINK.DEFAULT;
    this.logKindsKeys = PRIVATE_DATABASE_LOGS_KINDS_KEYS;
  }
}
