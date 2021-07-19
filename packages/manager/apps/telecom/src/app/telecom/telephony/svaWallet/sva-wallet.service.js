export default class SvaWalletService {
  /* @ngInject */
  constructor($q, ovhFeatureFlipping) {
    this.$q = $q;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
  }

  isFeatureAvailable() {
    return this.ovhFeatureFlipping
      .checkFeatureAvailability('telephony:sva-wallet')
      .then((featureAvailability) =>
        featureAvailability.isFeatureAvailable('telephony:sva-wallet'),
      );
  }

  isSvaWalletValid() {
    return this.$q.when(true);
  }
}
