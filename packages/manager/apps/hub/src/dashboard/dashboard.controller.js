import { TRACKING_PREFIX, HIT_PREFIX } from './dashboard.constant';

export default class DashboardController {
  /* @ngInject */
  constructor(coreURLBuilder, coreConfig, atInternet) {
    this.coreURLBuilder = coreURLBuilder;
    this.user = coreConfig.getUser();
    this.atInternet = atInternet;
    this.TRACKING_PREFIX = TRACKING_PREFIX;
    this.HIT_PREFIX = HIT_PREFIX;
  }

  $onInit() {
    this.availableSiretBanner = false;

    this.displaySiretBanner.then((data) => {
      this.availableSiretBanner =
        data &&
        !this.user.companyNationalIdentificationNumber &&
        this.user.legalform === 'corporation' &&
        this.user.country === 'FR';
      if (this.availableSiretBanner) {
        this.atInternet.trackPage({
          name: TRACKING_PREFIX,
          type: 'navigation',
        });
      }
    });
    this.ACCOUNT_DASHBOARD_URL = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/useraccount/infos?fieldToFocus=siretForm',
    );

    this.trackingPrefix.then((prefix) => {
      this.prefix = prefix;
    });
  }

  trackClick() {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}::${HIT_PREFIX}`,
      type: 'action',
    });
  }
}
