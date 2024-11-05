import {
  SUPPORT_URL,
  FRAUD_STATUS,
  TRACK_IMPRESSION_REQUIRED,
  TRACK_IMPRESSION_OPEN,
  FEATURES,
} from './kyc-fraud-banner.constants';

export default class KycFraudBannerController {
  /* @ngInject */
  constructor($http, coreURLBuilder, atInternet, coreConfig, ovhFeatureFlipping) {
    this.$http = $http;
    this.coreURLBuilder = coreURLBuilder;
    this.coreConfig = coreConfig;
    this.atInternet = atInternet;
    this.TRACK_IMPRESSION_REQUIRED = TRACK_IMPRESSION_REQUIRED;
    this.TRACK_IMPRESSION_OPEN = TRACK_IMPRESSION_OPEN;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
  }

  $onInit() {
    this.showRequiredBanner = false;
    this.showOpenBanner = false;

    this.ovhFeatureFlipping
      .checkFeatureAvailability(FEATURES.proceduresFraud)
      .then((result) => {
        if (result.isFeatureAvailable(FEATURES.proceduresFraud)) {
          this.initFraud();
        }
      });
  }

  initFraud() {
    this.documentLink = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/documents',
    );

    this.isSupportWithExternalLinks = this.coreConfig.isRegion(['EU', 'CA']);
    this.supportLink = this.isSupportWithExternalLinks
      ? SUPPORT_URL
      : this.coreURLBuilder.buildURL('dedicated', '#/ticket');

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
