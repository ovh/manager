import filter from 'lodash/filter';

export default class {
  /* @ngInject */
  constructor(OvhApiOrder) {
    this.OvhApiOrder = OvhApiOrder;
  }

  fetchContracts(offer, serviceName, ovhSubsidiary) {
    return this.OvhApiOrder.Cart()
      .v6()
      .post({
        ovhSubsidiary,
      })
      .$promise.then(({ cartId }) =>
        this.OvhApiOrder.Cart()
          .v6()
          .assign({
            cartId,
          })
          .$promise.then(
            () =>
              this.OvhApiOrder.CartServiceOption()
                .v6()
                .post(
                  {
                    productName: 'privateCloud',
                    serviceName,
                  },
                  {
                    cartId,
                    duration: offer.prices[0].duration,
                    planCode: offer.planCode,
                    pricingMode: offer.prices[0].pricingMode,
                    quantity: 1,
                  },
                ).$promise,
          )
          .then(
            () =>
              this.OvhApiOrder.Cart()
                .v6()
                .getCheckout({
                  cartId,
                }).$promise,
          ),
      )
      .then(({ contracts }) => contracts);
  }

  fetchOffers(serviceName) {
    return this.OvhApiOrder.CartServiceOption()
      .v6()
      .get({
        productName: 'privateCloud',
        serviceName,
      })
      .$promise.then((offers) =>
        filter(offers, { planCode: 'pcc-option-windows' }),
      );
  }
}
