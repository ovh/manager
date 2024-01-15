import {
  FRAUD_STATUS,
  TRACK_IMPRESSION_REQUIRED,
  TRACK_IMPRESSION_OPEN,
} from './kyc-fraud-banner.constants';

export default class KycFraudBannerController {
  /* @ngInject */
  constructor($http, $q, coreURLBuilder, atInternet) {
    this.$http = $http;
    this.$q = $q;
    this.coreURLBuilder = coreURLBuilder;
    this.atInternet = atInternet;
    this.TRACK_IMPRESSION_REQUIRED = TRACK_IMPRESSION_REQUIRED;
    this.TRACK_IMPRESSION_OPEN = TRACK_IMPRESSION_OPEN;
  }

  $onInit() {
    this.showRequiredBanner = false;
    this.showOpenBanner = false;

    this.documentLink = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/documents',
    );

    this.supportLink = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/support/tickets',
    );

    this.$http
      .get(`/me/procedure/fraud`)
      .then(({ data: { status, ticketId } }) => {
        if (status === FRAUD_STATUS.REQUIRED) {
          this.showRequiredBanner = true;
          this.atInternet.trackImpression(TRACK_IMPRESSION_REQUIRED);
        } else if (status === FRAUD_STATUS.OPEN && ticketId !== '') {
          this.showOpenBanner = true;
          this.atInternet.trackImpression(TRACK_IMPRESSION_OPEN);
        }
      });
  }

  trackClickImpression(data) {
    this.atInternet.trackClickImpression({
      click: data,
    });
  }
}
