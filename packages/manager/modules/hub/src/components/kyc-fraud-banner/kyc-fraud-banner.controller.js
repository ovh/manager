import { FRAUD_STATUS } from './kyc-fraud-banner.constants';

export default class KycFraudBannerController {
  /* @ngInject */
  constructor($http, $q, coreURLBuilder) {
    this.$http = $http;
    this.$q = $q;
    this.coreURLBuilder = coreURLBuilder;
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
        if (status === FRAUD_STATUS.REQUIRED) this.showRequiredBanner = true;
        else if (status === FRAUD_STATUS.OPEN && ticketId !== '')
          this.showOpenBanner = true;
      });
  }
}
