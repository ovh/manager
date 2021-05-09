import { OPTION_FAMILY_STAGING_ENVIRONMENT } from './constants';

export default class WebPaasProjectAdditionalOptionCtrl {
  /* @ngInject */
  getPrice() {
    const price = this.option?.getPrice();
    if (this.option.isStorageAddon()) {
      const stagingQuantity =
        this.project?.getTotalEnvironment() ||
        this.plan.addons?.find(
          (addon) => addon.family === OPTION_FAMILY_STAGING_ENVIRONMENT,
        ).quantity;
      return `${(2 + stagingQuantity) * price.value * this.option.quantity} ${
        this.user.currency.symbol
      }`;
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
