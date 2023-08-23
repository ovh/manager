import { FRAUD_STATUS } from './kyc-fraud-banner.constants';

export default class KycFraudBannerController {
  /* @ngInject */
  constructor($http, $q, coreURLBuilder, ovhFeatureFlipping) {
    this.$http = $http;
    this.$q = $q;
    this.coreURLBuilder = coreURLBuilder;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
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

    this.ovhFeatureFlipping
      .checkFeatureAvailability('documents')
      .catch(() => ({
        documents: false,
      }))
      .then((featureAvailability) =>
        featureAvailability.isFeatureAvailable('documents')
          ? this.$http.get(`/me/procedure/fraud`).then(({ data }) => {
              const { status, ticketId } = data;
              if (status === FRAUD_STATUS.REQUIRED)
                this.showRequiredBanner = true;
              if (status === FRAUD_STATUS.OK && ticketId !== '')
                this.showOpenBanner = true;
            })
          : this.$q.when([]),
      );
  }
}
