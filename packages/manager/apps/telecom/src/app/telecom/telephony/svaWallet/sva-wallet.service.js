export default class SvaWalletService {
  /* @ngInject */
  constructor($http, $q, ovhFeatureFlipping) {
    this.$http = $http;
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

  isSvaWalletValid(svaWallet) {
    return (svaWallet ? this.$q.when(svaWallet) : this.getSvaWallet())
      .then((wallet) => wallet.kyc.status === 'UP_TO_DATE')
      .catch(() => false);
  }

  getSvaWallet() {
    return this.$http.get('/me/sva/wallet').then(({ data: wallet }) => wallet);
  }
}
