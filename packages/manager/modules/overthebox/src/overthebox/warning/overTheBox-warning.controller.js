import { buildURL } from '@ovh-ux/ufrontend/url-builder';

export default class {
  /* @ngInject */
  constructor(CORE_URLS) {
    this.overTheBoxManager = CORE_URLS.overTheBoxManager;
    this.guide = CORE_URLS.guides.overTheBox;
    this.home = CORE_URLS.guides.home;
    this.paymentMeans = buildURL('dedicated', '#/billing/mean');
  }
}
