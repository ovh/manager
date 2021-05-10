import {
  OPTION_FAMILY_STAGING_ENVIRONMENT,
  STORAGE_MULTIPLE,
} from './constants';

export default class WebPaasProjectAdditionalOptionCtrl {
  getPrice() {
    const price = this.option?.getRenewablePrice();
    if (this.option.isStorageAddon()) {
      const stagingQuantity =
        this.project?.getTotalEnvironment() ||
        this.plan.addons?.find(
          (addon) => addon.family === OPTION_FAMILY_STAGING_ENVIRONMENT,
        ).quantity;
      return `${((2 + stagingQuantity) * price.value * this.option.quantity) /
        STORAGE_MULTIPLE} ${this.user.currency.symbol}`;
    }
    return `${price.value * (this.option.quantity || 0)} ${
      this.user.currency.symbol
    }`;
  }

  onSelected(model) {
    if (this.onChange) {
      this.onChange({ modelValue: model });
    }
  }
}
