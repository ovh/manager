export default class HostingCdnLogsDataStreamsController {
  /* @ngInject */
  constructor(
    trackClick,
    trackingHits,
    url,
    apiVersion,
    kind,
    goBack,
    logKinds,
    logSubscriptionApiData,
  ) {
    this.trackClick = trackClick;
    this.trackingHits = trackingHits;
    this.url = url;
    this.apiVersion = apiVersion;
    this.kind = kind;
    this.goBack = goBack;
    this.logKinds = logKinds;
    this.logSubscriptionApiData = logSubscriptionApiData;
  }
}
