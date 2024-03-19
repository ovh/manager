import find from 'lodash/find';

import {
  PCI_PROJECT_ORDER_CART,
  PCI_PROJECT_DISCOVERY_ORDER_CART,
} from '../constants';
import {
  PCI_HDS_ADDON,
  PCI_HDS_DISCOVERY_ADDON,
} from '../../project/project.constants';

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
        cartItem.settings.planCode === PCI_PROJECT_ORDER_CART.planCode ||
        cartItem.settings.planCode ===
          PCI_PROJECT_DISCOVERY_ORDER_CART.planCode,
    );
  }

  get hdsItem() {
    return find(
      this.items,
      (cartItem) =>
        cartItem.settings.planCode === PCI_HDS_ADDON.planCode ||
        cartItem.settings.planCode === PCI_HDS_DISCOVERY_ADDON.planCode,
    );
  }

  get creditOption() {
    return find(
      this.items,
      (cartItem) =>
        cartItem.settings.planCode === PCI_PROJECT_ORDER_CART.creditPlanCode ||
        cartItem.settings.planCode ===
          PCI_PROJECT_DISCOVERY_ORDER_CART.creditPlanCode,
    );
  }

  addItem(itemOptions) {
    const item = new PciCartProjectItem(itemOptions);
    this.items.push(item);
    return item;
  }

  deleteItem(itemOptions) {
    const itemIndex = this.items.findIndex(
      ({ itemId }) => itemId === itemOptions.itemId,
    );
    this.items.splice(itemIndex);
  }
}
