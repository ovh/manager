import set from 'lodash/set';
import {
  ADDON_FAMILY,
  DEFAULT_ENVIRONMENT_COUNT,
  STORAGE_MULTIPLE,
} from '../../web-paas.constants';

export default class WebPaasProjectAdditionalOptionCtrl {
  getPrice() {
    if (this.option.quantity === undefined) {
      set(this.option, 'quantity', 0);
    }
    const price = this.option?.getRenewablePrice();
    if (this.option.isStorageAddon()) {
      if (this.project) {
        return (price.value * this.option.quantity) / STORAGE_MULTIPLE;
      }
      const stagingQuantity = this.plan.addons?.find(
        (addon) => addon.family === ADDON_FAMILY.ENVIRONMENT,
      ).quantity;
      return (
        ((DEFAULT_ENVIRONMENT_COUNT + (stagingQuantity || 0)) *
          price.value *
          this.option.quantity) /
        STORAGE_MULTIPLE
      );
    }
    return price.value * this.option.quantity;
  }

  onSelected(model) {
    if (this.onChange) {
      this.onChange({ modelValue: model });
    }
  }
}
