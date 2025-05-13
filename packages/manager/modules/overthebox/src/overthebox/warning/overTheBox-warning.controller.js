export default class {
  /* @ngInject */
  constructor(CORE_URLS, coreURLBuilder) {
    this.overTheBoxManager = CORE_URLS.overTheBoxManager;
    this.guide = CORE_URLS.guides.overTheBox;
    this.home = CORE_URLS.guides.home;
    this.paymentMeans = coreURLBuilder.buildURL('dedicated', '#/billing/mean');
  }
}
