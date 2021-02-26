import find from 'lodash/find';
import head from 'lodash/head';
import map from 'lodash/map';

import PciCartProject from './classes/cart.class';

import { PCI_PROJECT_ORDER_CART } from './constants';

export default class PciProjectNewService {
  /* @ngInject */
  constructor(OrderCartService, OvhApiCloud, OvhApiOrder) {
    this.orderCart = OrderCartService;
    this.OvhApiCloud = OvhApiCloud;
    this.OvhApiOrder = OvhApiOrder;
  }

  checkEligibility(voucher = null) {
    return this.OvhApiCloud.v6().getEligibility({ voucher }).$promise;
  }

  /**
   *  Get order cart from it's id or get a new one
   *  @param  {string} ovhSubsidiary The subsidiary of the possible new cart
   *  @param  {string} [cartId]      A previously created cart id
   *  @return {Promise}              That returns a cart.
   */
  async getOrderCart(ovhSubsidiary, cartId = null) {
    let orderCart;

    if (cartId) {
      orderCart = await this.OvhApiOrder.Cart()
        .v6()
        .get({ cartId })
        .$promise.catch((error) => {
          if (error.status === 404) {
            return this.createOrderCart(ovhSubsidiary);
          }

          return Promise.reject(error);
        });
    } else {
      orderCart = await this.createOrderCart(ovhSubsidiary);
    }

    const orderCartInstance = new PciCartProject(orderCart);

    if (!orderCart.items.length) {
      await this.createOrderCartProjectItem(orderCartInstance);
    } else {
      await this.getOrderCartItems(orderCartInstance);
      if (!orderCartInstance.projectItem) {
        await this.createOrderCartProjectItem(orderCartInstance);
      } else {
        await this.getOrderCartProjectItemConfigurations(
          orderCartInstance.projectItem,
        );
      }
    }

    return orderCartInstance;
  }

  /**
   *  Create an order cart
   *  @param  {string} ovhSubsidiary The subsidiary of the cart.
   *  @return {Promise}              Which returns the new created cart.
   */
  async createOrderCart(ovhSubsidiary) {
    let newOrderCart = await this.orderCart.createNewCart(ovhSubsidiary);

    newOrderCart = new PciCartProject(newOrderCart);
    await this.orderCart.assignCart(newOrderCart.cartId);

    return newOrderCart;
  }

  async createOrderCartProjectItem(orderCart) {
    const { cartId } = orderCart;
    const cloudOffers = await this.orderCart.getProductOffers(
      cartId,
      PCI_PROJECT_ORDER_CART.productName,
    );
    const cloudProjectOffer = find(cloudOffers, {
      planCode: PCI_PROJECT_ORDER_CART.planCode,
    });

    // check if project.2018 offer is present
    // if not reject
    if (!cloudProjectOffer) {
      const error = {
        status: 404,
        data: {
          message: `planCode ${PCI_PROJECT_ORDER_CART.planCode} not found`,
        },
      };
      return Promise.reject(error);
    }

    // otherwise add it to the cart
    const { duration, pricingMode } = head(cloudProjectOffer.prices);
    const projectItem = await this.orderCart.addProductToCart(
      cartId,
      PCI_PROJECT_ORDER_CART.productName,
      {
        duration,
        planCode: PCI_PROJECT_ORDER_CART.planCode,
        pricingMode,
        quantity: 1,
      },
    );

    return orderCart.addItem(projectItem);
  }

  async getOrderCartItems(orderCart) {
    const { cartId } = orderCart;
    const itemIds = await this.OvhApiOrder.Cart()
      .Item()
      .v6()
      .query({
        cartId,
      }).$promise;
    const itemDetailsPromises = map(itemIds, (itemId) =>
      this.OvhApiOrder.Cart()
        .Item()
        .v6()
        .get({
          cartId,
          itemId,
        })
        .$promise.then((item) => orderCart.addItem(item)),
    );
    await Promise.all(itemDetailsPromises);
    return orderCart.items;
  }

  async getOrderCartProjectItemConfigurations(cloudProjectItem) {
    const { cartId, itemId } = cloudProjectItem;
    // get configurations ids of the cloud project item
    const configurationIds = await this.OvhApiOrder.Cart()
      .Item()
      .Configuration()
      .v6()
      .query({
        cartId,
        itemId,
      }).$promise;
    // get the configuration details of the cloud project item
    const configPromises = map(configurationIds, (configurationId) =>
      this.OvhApiOrder.Cart()
        .Item()
        .Configuration()
        .v6()
        .get({
          cartId,
          itemId,
          configurationId,
        })
        .$promise.then((configuration) =>
          cloudProjectItem.addConfiguration(configuration),
        ),
    );
    // wait for all requests done
    await Promise.all(configPromises);
    return cloudProjectItem.configurations;
  }

  setCartProjectItemDescription(orderCart, description) {
    const { cartId, itemId } = orderCart.projectItem;
    return this.orderCart
      .addConfigurationItem(cartId, itemId, 'description', description)
      .then((descriptionConfig) =>
        orderCart.projectItem.addConfiguration(descriptionConfig),
      );
  }

  setCartProjectItemInfrastructure(orderCart) {
    const { cartId, itemId } = orderCart.projectItem;
    return this.orderCart
      .addConfigurationItem(
        cartId,
        itemId,
        'infrastructure',
        PCI_PROJECT_ORDER_CART.infraConfigValue,
      )
      .then((infrastructureConfig) =>
        orderCart.projectItem.addConfiguration(infrastructureConfig),
      );
  }

  setCartProjectItemVoucher(orderCart, voucherCode) {
    const { cartId, itemId } = orderCart.projectItem;
    return this.orderCart
      .addConfigurationItem(cartId, itemId, 'voucher', voucherCode)
      .then((voucherConfig) =>
        orderCart.projectItem.addConfiguration(voucherConfig),
      );
  }

  removeCartProjectItemVoucher(orderCart) {
    const { cartId, itemId } = orderCart.projectItem;
    const { id } = orderCart.projectItem.voucherConfiguration;
    return this.orderCart
      .deleteConfigurationItem(cartId, itemId, id)
      .then(() => orderCart.projectItem.removeConfiguration(id));
  }

  /**
   *  Add credit to order cart project.2018 item
   */
  setCartProjectItemCredit(orderCart, amount) {
    // first get the info of credit option
    const { cartId, itemId } = orderCart.projectItem;
    return this.orderCart
      .getProductOptions(
        cartId,
        PCI_PROJECT_ORDER_CART.productName,
        PCI_PROJECT_ORDER_CART.planCode,
      )
      .then((options) => {
        const cloudCredit = find(options, {
          planCode: PCI_PROJECT_ORDER_CART.creditPlanCode,
        });

        // check if cloud.credit option is present
        // if not reject
        if (!cloudCredit) {
          const error = {
            status: 404,
            data: {
              message: `Option with planCode ${PCI_PROJECT_ORDER_CART.creditPlanCode} not found`,
            },
          };
          return Promise.reject(error);
        }

        const { duration, pricingMode, price } = head(cloudCredit.prices);

        return this.orderCart
          .addProductOptionToCart(cartId, PCI_PROJECT_ORDER_CART.productName, {
            planCode: PCI_PROJECT_ORDER_CART.creditPlanCode,
            quantity: amount / price.value,
            duration,
            pricingMode,
            itemId,
          })
          .then((creditOption) => orderCart.addItem(creditOption));
      });
  }

  checkoutCart({ cartId }) {
    return this.orderCart.getCheckoutInformations(cartId);
  }

  finalizeCart({ cartId }) {
    return this.orderCart.checkoutCart(cartId);
  }
}
