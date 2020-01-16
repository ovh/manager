import find from 'lodash/find';

import { PCI_PROJECT_ORDER_CART } from '../constants';

import PciCartProjectItem from './cart.project.item.class';

export default class PciCartProject {
  constructor(options) {
    this.cartId = options.cartId;
    this.items = [];
  }

  get projectItem() {
    return find(
      this.items,
      (cartItem) =>
        cartItem.settings.planCode === PCI_PROJECT_ORDER_CART.planCode,
    );
  }

  get creditOption() {
    return find(
      this.items,
      (cartItem) =>
        cartItem.settings.planCode === PCI_PROJECT_ORDER_CART.creditPlanCode,
    );
  }

  addItem(itemOptions) {
    const item = new PciCartProjectItem(itemOptions);
    this.items.push(item);
    return item;
  }
}
