import set from 'lodash/set';
import {
  ADDON_FAMILY_STAGING_ENVIRONMENT,
  STORAGE_MULTIPLE,
  DEFAULT_ENVIRONMENT,
} from './constants';

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
        (addon) => addon.family === ADDON_FAMILY_STAGING_ENVIRONMENT,
      ).quantity;
      return (
        ((DEFAULT_ENVIRONMENT + (stagingQuantity || 0)) *
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
