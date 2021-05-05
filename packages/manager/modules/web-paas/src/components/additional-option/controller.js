import get from 'lodash/get';

export default class WebPaasProjectAdditionalOptionCtrl {
  getPrice() {
    const { price } = get(this.option, 'prices').find(({ capacities }) =>
      capacities.includes('renew'),
    );
    if (this.option.planCode === 'storage') {
      const stagingQuantity =
        this.project?.totalEnvironment() ||
        this.plan.addons?.find(
          (addon) => addon.family === 'staging_environment',
        ).quantity;
      return `${(2 + stagingQuantity) *
        price.value *
        this.option.quantity} ${price.text.split('').pop()}`;
    }
    return `${price.value * (this.option.quantity || 0)} ${price.text
      .split('')
      .pop()}`;
  }
}
