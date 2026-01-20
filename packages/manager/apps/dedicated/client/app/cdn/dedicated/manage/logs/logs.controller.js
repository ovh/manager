export default class CdnDedicatedLogsController {
  /* @ngInject */
  constructor(
    $translate,
    trackClick,
    trackingHits,
    url,
    apiVersion,
    kind,
    description,
    goToListingPage,
    logKinds,
    logKindsKeys,
    logServiceGuideLink,
  ) {
    this.$translate = $translate;
    this.trackClick = trackClick;
    this.trackingHits = trackingHits;
    this.url = url;
    this.apiVersion = apiVersion;
    this.kind = kind;
    this.description = description;
    this.goToListingPage = goToListingPage;
    this.logKinds = logKinds;
    this.logKindsKeys = logKindsKeys;
    this.logServiceGuideLink = logServiceGuideLink;
  }
}
