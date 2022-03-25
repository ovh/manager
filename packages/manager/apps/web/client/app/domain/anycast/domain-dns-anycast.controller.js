import get from 'lodash/get';
import {
  DNS_ANYCAST_SERVICE_TYPE,
  DNS_ANYCAST_PLANCODE,
  DNS_ANYCAST_DURATION,
} from './domain-dns-anycast.constants';

export default class DomainDnsAnycastActivateCtrl {
  /* @ngInject */
  constructor($q, Domain, WucOrderCartService) {
    this.$q = $q;
    this.Domain = Domain;
    this.WucOrderCartService = WucOrderCartService;
  }

  $onInit() {
    this.loading = true;
    return this.fetchCatalogOffer(this.domainName)
      .then((offer) => {
        this.offer = offer;
        this.offerPrice = this.offer.prices.find(
          (price) => price.duration === DNS_ANYCAST_DURATION,
        );
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
    ).then((options) =>
      options.find((option) => DNS_ANYCAST_PLANCODE.includes(option.planCode)),
    );
  }

  fetchDomainExpiration() {
    this.loadingSecondStep = true;
    this.Domain.getZoneServiceInfo(this.domainName)
      .then(({ expiration }) => {
        this.domainExpiryDate = expiration;
      })
      .finally(() => {
        this.loadingSecondStep = false;
      });
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
