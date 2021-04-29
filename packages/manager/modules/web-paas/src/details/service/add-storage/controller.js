export default class {
  /* @ngInject */
  constructor($q, WebPaas) {
    this.$q = $q;
    this.WebPaas = WebPaas;
  }

  addStorage() {
    this.WebPaas.getAddonSummary(this.project, [this.storageAddon])
      .then(({ contracts, prices, cart }) => {
        this.cart = cart;
        this.contracts = contracts;
        this.prices = prices;
      })
      .catch((error) =>
        !this.onError || this.onError({ error }) === false
          ? this.$q.reject(error)
          : null,
      )
      .finally(() => {
        this.isGettingCheckoutInfo = false;
      });
  }
}
