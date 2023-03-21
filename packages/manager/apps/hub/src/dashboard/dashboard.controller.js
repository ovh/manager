import {
  TRACKING_PREFIX,
  HIT_PREFIX,
  TRACKING_PREFIX_POPUP,
} from './dashboard.constant';

export default class DashboardController {
  /* @ngInject */
  constructor(coreURLBuilder, atInternet, $window, $http) {
    this.coreURLBuilder = coreURLBuilder;
    this.atInternet = atInternet;
    this.$window = $window;
    this.TRACKING_PREFIX = TRACKING_PREFIX;
    this.HIT_PREFIX = HIT_PREFIX;
    this.TRACKING_PREFIX_POPUP = TRACKING_PREFIX_POPUP;
    this.$http = $http;
  }

  $onInit() {
    this.availableSiretBanner = false;
    this.availableSiretPopup = false;

    this.$http
      .get('/me')
      .then(({ data }) => {
        this.getNicInfo = data;
        this.userSiretFR =
          !this.getNicInfo.companyNationalIdentificationNumber &&
          this.getNicInfo.legalform === 'corporation' &&
          this.getNicInfo.country === 'FR';
      })
      .then(() => {
        return this.callFeatureAvailabiltySiret;
      })
      .then((data) => {
        this.availableSiretBanner =
          data.isFeatureAvailable('hub:banner-hub-invite-customer-siret') &&
          this.userSiretFR;
        this.availableSiretPopup =
          data.isFeatureAvailable('hub:popup-hub-invite-customer-siret') &&
          this.userSiretFR;
        if (this.availableSiretBanner) {
          this.atInternet.trackPage({
            name: TRACKING_PREFIX,
            type: 'navigation',
          });
        }
        if (this.availableSiretPopup) {
          this.atInternet.trackPage({
            name: TRACKING_PREFIX_POPUP,
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

  goToSiretModification() {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX_POPUP}::confirm`,
      type: 'action',
    });
    return this.$window.open(this.ACCOUNT_DASHBOARD_URL, '_top');
  }

  cancelToSiretModification() {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX_POPUP}::cancel`,
      type: 'action',
    });
    this.availableSiretPopup = false;
  }

  trackClick() {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}::${HIT_PREFIX}`,
      type: 'action',
    });
  }
}
