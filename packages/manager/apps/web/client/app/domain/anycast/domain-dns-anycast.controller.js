import find from 'lodash/find';
import get from 'lodash/get';
import {
  DNS_ANYCAST_SERVICE_TYPE,
  DNS_ANYCAST_PLANCODE,
  DNS_ANYCAST_PRICING_MODE,
  DNS_ANYCAST_DURATION,
} from './domain-dns-anycast.constants';

export default class DomainDnsAnycastActivateCtrl {
  /* @ngInject */
  constructor($q, WucOrderCartService) {
    this.$q = $q;
    this.WucOrderCartService = WucOrderCartService;
  }

  $onInit() {
    this.loading = true;
    return this.fetchCatalogOffer(this.domainName)
      .then((offer) => {
        this.offer = offer;
        this.offerPrice = find(this.offer.prices, {
          pricingMode: DNS_ANYCAST_PRICING_MODE,
          duration: DNS_ANYCAST_DURATION,
        });
        return this.fetchNewCart().then((cart) =>
          this.WucOrderCartService.addProductServiceOptionToCart(
            cart.cartId,
            DNS_ANYCAST_SERVICE_TYPE,
            this.domainName,
            {
              duration: this.offerPrice.duration,
              planCode: this.offer.planCode,
              pricingMode: this.offerPrice.pricingMode,
              quantity: this.offerPrice.minimumQuantity,
            },
          )
            .then(() =>
              this.WucOrderCartService.getCheckoutInformations(cart.cartId),
            )
            .then((checkout) => {
              this.cart = cart;
              this.checkoutInfos = checkout;
            }),
        );
      })
      .catch((error) => {
        this.error = get(error, 'data.message', error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  fetchNewCart() {
    return this.WucOrderCartService.createNewCart(
      this.user.ovhSubsidiary,
    ).then((cart) =>
      this.WucOrderCartService.assignCart(cart.cartId).then(() => cart),
    );
  }

  fetchCatalogOffer(serviceName) {
    return this.WucOrderCartService.getProductServiceOptions(
      DNS_ANYCAST_SERVICE_TYPE,
      serviceName,
    ).then((options) => find(options, { planCode: DNS_ANYCAST_PLANCODE }));
  }

  performCheckout() {
    this.isCheckoutPending = true;
    return this.$q((resolve, reject) => {
      this.WucOrderCartService.checkoutCart(this.cart.cartId, {
        autoPayWithPreferredPaymentMethod: !!this.defaultPaymentMethod,
        waiveRetractationPeriod: false,
      })
        .then(resolve)
        .catch(reject);
    })
      .then((checkout) => {
        this.checkoutSuccess = checkout;
      })
      .catch((error) => {
        this.error = get(error, 'data.message', error);
      })
      .finally(() => {
        this.isCheckoutPending = false;
      });
  }
}
