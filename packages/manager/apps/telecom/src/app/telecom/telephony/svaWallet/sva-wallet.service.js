import { isKYCValid } from './sva-wallet.constants';

export default class SvaWalletService {
  /* @ngInject */
  constructor($http, $q, $window, ovhFeatureFlipping) {
    this.$http = $http;
    this.$q = $q;
    this.$window = $window;
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
      .then((wallet) => isKYCValid(wallet))
      .catch(() => false);
  }

  getSvaWallet() {
    return this.$http.get('/me/sva/wallet').then(({ data: wallet }) => wallet);
  }

  getCompanyKinds() {
    return this.$http
      .get('/me.json')
      .then(
        ({ data: schema }) =>
          schema.models['me.sva.wallet.CompanyKindEnum'].enum,
      );
  }

  saveWallet(wallet, iban) {
    return this.$http.post('/me/sva/wallet', wallet).then(() => {
      if (iban) {
        return this.saveWalletIban(iban);
      }
      return this.$q.resolve();
    });
  }

  saveWalletIban(iban) {
    return this.$http.post('/me/sva/wallet/bankAccount', { iban });
  }

  getBankAccount() {
    return this.$http
      .get('/me/sva/wallet/bankAccount')
      .then(({ data }) => data)
      .catch(() => ({}));
  }

  uploadDocument(document, file) {
    const createDocument = () =>
      this.$http
        .post('/me/document', {
          name: file.name,
        })
        .then(({ data }) => data);

    const applyCors = () =>
      this.$http
        .post('/me/document/cors', {
          origin: this.$window.location.origin,
        })
        .catch(() => {});

    const saveDocumentFile = (putUrl) =>
      this.$http
        .put(putUrl, file, {
          headers: {
            'Content-type': 'multipart/form-data',
          },
        })
        .then(({ data }) => data.id);

    const getDocument = (id) =>
      this.$http.get(`/me/document/${id}`).then(({ data }) => data);

    const associateSvaDocument = (documentId) =>
      this.$http
        .post('/me/sva/wallet/document', {
          documentId,
          id: document.id,
          type: document.type,
        })
        .then(({ data }) => data);

    return createDocument()
      .then(({ putUrl, id }) => {
        return applyCors()
          .then(() => saveDocumentFile(putUrl))
          .then(() => getDocument(id))
          .then(() => associateSvaDocument(id));
      })
      .catch(({ data }) => this.$q.reject(data));
  }
}
