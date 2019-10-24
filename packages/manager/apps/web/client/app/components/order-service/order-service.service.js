export default class OrderService {
  /* @ngInject */
  constructor(OvhApiOrder) {
    this.OvhApiOrder = OvhApiOrder;
  }

  createNewCart(ovhSubsidiary) {
    return this.OvhApiOrder.Cart().v6()
      .post({}, { ovhSubsidiary })
      .$promise;
  }

  assignCart(cartId) {
    return this.OvhApiOrder.Cart().v6()
      .assign({ cartId })
      .$promise;
  }

  deleteCart(cartId) {
    return this.OvhApiOrder.Cart().v6()
      .delete({ cartId })
      .$promise;
  }

  getProductOffers(cartId, productName) {
    return this.OvhApiOrder.Cart().Product().v6()
      .get({
        cartId,
        productName,
      })
      .$promise;
  }

  getProductOptions(cartId, productName, productPlanCode) {
    return this.OvhApiOrder.Cart().Product().v6()
      .getOptions({
        cartId,
        productName,
        ...productPlanCode,
      })
      .$promise;
  }

  addProductOptionToCart(cartId, productName, option) {
    return this.OvhApiOrder.Cart().Product().v6()
      .postOptions({
        cartId,
        productName,
        ...option,
      });
  }

  addConfigurationItem(cartId, itemId, label, value) {
    return this.OvhApiOrder.Cart().Item().Configuration().v6()
      .post({
        cartId,
        itemId,
      }, {
        label,
        value,
      })
      .$promise;
  }

  getCheckoutInformations(cartId) {
    return this.OvhApiOrder.Cart().v6()
      .getCheckout({
        cartId,
      })
      .$promise;
  }

  checkoutCart(cartId, checkout) {
    return this.OvhApiOrder.Cart().v6()
      .checkout({
        cartId,
        ...checkout,
      })
      .$promise;
  }

  getProductPublicCatalog(ovhSubsidiary, productName) {
    return this.OvhApiOrder.Catalog().Public().v6()
      .get({
        ovhSubsidiary,
        productName,
      })
      .$promise;
  }

  getProductServiceOptions(productName, serviceName) {
    return this.OvhApiOrder.CartServiceOption().v6()
      .get({
        productName,
        serviceName,
      })
      .$promise;
  }

  addProductServiceOptionToCart(cartId, productName, serviceName, serviceOption) {
    return this.OvhApiOrder.CartServiceOption().v6()
      .post({
        cartId,
        productName,
        serviceName,
        ...serviceOption,
      })
      .$promise;
  }
}
