/**
 * Cart order management service, based on API /order/cart
 * It is, for the moment, aimed to handle order of product, or existing product
 * upgrades.
 * All carts must be assigned before they are used.
 */
export default class OrderCartService {
  /* @ngInject */
  constructor($q, OvhApiMe, OvhApiOrder) {
    this.$q = $q;
    this.OvhApiMe = OvhApiMe;
    this.OvhApiOrder = OvhApiOrder;
  }

  /**
   * Gets the cart by cartId
   *
   * @param  {string} cartId        The cart Id
   * @return {Promise<Object>}      Promise of the cart
   */
  getCart(cartId) {
    return this.OvhApiOrder.Cart()
      .v6()
      .get({ cartId }).$promise;
  }

  /**
   * Will create a new cart for the user
   *
   * @param  {string} ovhSubsidiary OVHcloud Subsidiary in order to propose
   * localized offers
   * @return {Promise<Object>}      Promise of the new created cart
   */
  createNewCart(ovhSubsidiary) {
    return this.OvhApiOrder.Cart()
      .v6()
      .post({}, { ovhSubsidiary }).$promise;
  }

  /**
   * Assign the cart, which is required before handling any offer
   *
   * @param  {string} cartId      Identification number of the cart
   * @return {Promise<Object>}    Promise of the assign cart
   */
  assignCart(cartId) {
    return this.OvhApiOrder.Cart()
      .v6()
      .assign({ cartId }).$promise;
  }

  /**
   * Remove an assigned cart
   *
   * @param  {string} cartId  Identification number of the cart
   * @return {Promise}        Promise of cart removal
   */
  deleteCart(cartId) {
    return this.OvhApiOrder.Cart()
      .v6()
      .delete({ cartId }).$promise;
  }

  /**
   * Get offers for a given product, for a given cart
   *
   * @param  {string} cartId       Identification number of the cart
   * @param  {string} productName  Name of the product to get offers
   * @return {Promise<Array>}      Promise of offers list
   */
  getProductOffers(cartId, productName) {
    return this.OvhApiOrder.Cart()
      .Product()
      .v6()
      .get({
        cartId,
        productName,
      }).$promise;
  }

  /**
   * Add a new product, to be ordered, to the cart
   *
   * @param  {string} cartId       Identification number of the cart
   * @param  {string} productName  Name of the new product
   * @param  {Object} product      Configuration of the product
   * @return {Promise<Object>}     Promise of the new product added into the
   * cart, with identification information to add configuration if needed
   */
  addProductToCart(cartId, productName, product) {
    return this.OvhApiOrder.Cart()
      .Product()
      .v6()
      .post(
        {
          cartId,
          productName,
        },
        product,
      ).$promise;
  }

  /**
   * Add an option to the cloud project
   *
   * @param  {string} cartId       Identification number of the cart
   * @param  {string} option       The new option
   * @return {Promise<Object>}     Promise of the new added option
   */
  addNewOptionToProject(cartId, option) {
    return this.$http
      .post(`/order/cart/${cartId}/cloud/options `, option)
      .then(({ data: item }) => item);
  }

  /**
   * Add a cloud option to cart
   *
   * @param  {string} serviceName  The cloud project id
   * @param  {string} option       The new option
   * @return {Promise<Object>}     Promise of the new added option
   */
  addOptionToCart(serviceName, option) {
    return this.$http
      .post(`/order/cartServiceOption/cloud/${serviceName}`, option)
      .then(({ data }) => data);
  }

  /**
   * Get available options for a new product to order
   *
   * @param  {string} cartId          Identification number of the cart
   * @param  {string} productName     Name of the product
   * @param  {string} planCode        Plan code of the selected product (ex:
   * for the product 'webHosting', get options for the plan code 'cloudweb1')
   * @return {Promise<Array>}         Promise of the product available list of
   * options
   */
  getProductOptions(cartId, productName, planCode) {
    return this.OvhApiOrder.Cart()
      .Product()
      .v6()
      .getOptions({
        cartId,
        productName,
        planCode,
      }).$promise;
  }

  /**
   * Add an option for a new product to order
   *
   * @param  {string} cartId      Identification number of the cart
   * @param  {string} productName Name of the product
   * @param  {Object} option      Product option configuration
   * @return {Promise<Object>}    Promise of the product option added into the
   * cart
   */
  addProductOptionToCart(cartId, productName, option) {
    return this.OvhApiOrder.Cart()
      .Product()
      .v6()
      .postOptions({
        cartId,
        productName,
        ...option,
      }).$promise;
  }

  /**
   * Add configuration item to a product
   *
   * @param  {string} cartId   Identification number of the cart
   * @param  {string} itemId   Identification number of the product
   * @param  {string} label    Configuration item label key
   * @param  {string} value    Configuration item value
   * @return {Promise<Object>} Promise of the configuration item added into the
   * cart
   */
  addConfigurationItem(cartId, itemId, label, value) {
    return this.OvhApiOrder.Cart()
      .Item()
      .Configuration()
      .v6()
      .post(
        {
          cartId,
          itemId,
        },
        {
          label,
          value,
        },
      ).$promise;
  }

  /**
   * Delete a configuration item for the product
   *
   * @param  {string} cartId          Identification number of the cart
   * @param  {string} itemId          Identification number of the product of
   * which to delete an item
   * @param  {string} configurationId Identification number of the configuration
   * item
   * @return {Promise}                Promise of the deleted configuration item
   */
  deleteConfigurationItem(cartId, itemId, configurationId) {
    return this.OvhApiOrder.Cart()
      .Item()
      .Configuration()
      .v6()
      .delete({
        cartId,
        itemId,
        configurationId,
      }).$promise;
  }

  /**
   * Get the information for checkout an order
   *
   * @param  {string} cartId    Identification number of the cart
   * @return {Promise<Object>}  Promise of the checkout information
   */
  getCheckoutInformations(cartId) {
    return this.OvhApiOrder.Cart()
      .v6()
      .getCheckout({
        cartId,
      }).$promise;
  }

  /**
   * Get a summary of your current order
   *
   * @param  {string} cartId    Identification number of the cart
   * @return {Promise<Object>}  Promise of the checkout order information
   */
  getSummary(cartId) {
    return this.OvhApiOrder.Cart()
      .v6()
      .summary({
        cartId,
      }).$promise;
  }

  /**
   * Checkout an order
   *
   * @param  {string} cartId   Identification number of the cart
   * @param  {Object} checkout Checkout configuration
   * @return {Promise<Object>} Promise of the checkout result
   */
  async checkoutCart(cartId, checkout) {
    const order = await this.OvhApiOrder.Cart()
      .v6()
      .checkout(
        {
          cartId,
        },
        {
          ...checkout,
        },
      ).$promise;

    if (
      !checkout?.autoPayWithPreferredPaymentMethod &&
      order.prices.withTax.value === 0
    ) {
      await this.OvhApiMe.Order()
        .v6()
        .payRegisteredPaymentMean(
          {
            orderId: order.orderId,
          },
          {
            paymentMean: 'fidelityAccount',
          },
        ).$promise;
    }

    return order;
  }

  /**
   * Get the details for a product, in the public catalog, for a given subsidiary
   *
   * @param  {string} ovhSubsidiary OVHcloud Subsidiary of the user in which to
   * get the public catalog
   * @param  {string} productName   Name of product to get catalog
   * @return {Promise<Object>}      Promise of the product details in the
   * public catalog
   */
  getProductPublicCatalog(ovhSubsidiary, productName) {
    return this.OvhApiOrder.Catalog()
      .Public()
      .v6()
      .get({
        ovhSubsidiary,
        productName,
      }).$promise;
  }

  /**
   * Get the available options for an existing service
   *
   * @param  {string} productName Name of the product
   * @param  {string} serviceName Name of the existing service
   * @return {Promise<Array>}     Promise of the product options list
   */
  getProductServiceOptions(productName, serviceName) {
    return this.OvhApiOrder.CartServiceOption()
      .v6()
      .get({
        productName,
        serviceName,
      }).$promise;
  }

  /**
   * Add an option to order, for an existing service
   *
   * @param  {string} cartId        Identification number of the cart
   * @param  {string} productName   Name of the product
   * @param  {string} serviceName   Name of the existing service
   * @param  {string} serviceOption New option to add for the service
   * @return {Promise<Object>}      Promise of the product option added into the
   * cart
   */
  addProductServiceOptionToCart(
    cartId,
    productName,
    serviceName,
    serviceOption,
  ) {
    return this.OvhApiOrder.CartServiceOption()
      .v6()
      .post({
        cartId,
        productName,
        serviceName,
        ...serviceOption,
      }).$promise;
  }

  /**
   * Get all cart items
   *
   * @param  {string} cartId  Identification number of the cart
   * @return {Promise<Array>} Promise of the cart items list of ids
   */
  getCartItems(cartId) {
    return this.OvhApiOrder.Cart()
      .Item()
      .v6()
      .query({ cartId }).$promise;
  }

  /**
   * Delete an item from the cart
   *
   * @param  {string} cartId Identification number of the cart
   * @param  {string} itemId description
   * @return {Promise}       Promise of the deleted item
   */
  deleteItem(cartId, itemId) {
    return this.OvhApiOrder.Cart()
      .Item()
      .v6()
      .delete({ cartId, itemId }).$promise;
  }

  /**
   * Delete all items from the cart
   *
   * @param  {string} cartId Identification number of the cart
   * @return {Promise}       Promise of the list of deleted items
   */
  deleteAllItems(cartId) {
    this.OvhApiOrder.Cart()
      .Item()
      .v6()
      .resetQueryCache();
    return this.getCartItems(cartId).then((itemsId) =>
      this.$q.all(itemsId.map((id) => this.deleteItem(cartId, id))),
    );
  }

  /**
   * Get the complete schema of /order/cart API
   *
   * @return {Promise<Object>}  Promise of the API route schema
   */
  getOrderApiSchema() {
    return this.OvhApiOrder.v6().schema().$promise;
  }
}
