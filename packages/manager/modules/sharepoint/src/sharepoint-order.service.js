export default class MicrosoftSharepointOrderService {
  /* @ngInject */
  constructor(OvhApiMsServices, OvhApiOrder, User) {
    this.OvhApiMsServices = OvhApiMsServices;
    this.OvhApiOrder = OvhApiOrder;
    this.User = User;
  }

  fetchingDoesServiceUseAgora(serviceName) {
    return this.OvhApiMsServices.Sharepoint()
      .v6()
      .doesServiceUseAgora({ serviceName }).$promise;
  }

  creatingCart() {
    return this.User.getUser()
      .then(
        ({ ovhSubsidiary }) =>
          this.OvhApiOrder.Cart().v6().post({ ovhSubsidiary }).$promise,
      )
      .then(
        ({ cartId }) =>
          this.OvhApiOrder.Cart().v6().assign({ cartId }).$promise,
      )
      .then(({ cartId }) => cartId);
  }

  fetchingPrices(cartId, planCode, subPlanCode) {
    return this.OvhApiOrder.Cart()
      .Microsoft()
      .v6()
      .getOptions({ cartId, planCode })
      .$promise.then((offers) =>
        offers
          .find((offer) => offer.planCode === subPlanCode)
          .prices // non-zero priceInUcents means the price is usable
          .filter((price) => price.priceInUcents !== 0)
          .reduce(
            (result, price) => ({
              ...result,
              // a bug with the API prevents us from using price.duration
              [price.interval === 1 ? 'P1M' : 'P1Y']: {
                ...price.price,
                maximumQuantity: price.maximumQuantity,
                minimumQuantity: price.minimumQuantity,
              },
            }),
            {},
          ),
      );
  }
}
