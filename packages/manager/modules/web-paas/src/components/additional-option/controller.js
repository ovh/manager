import get from 'lodash/get';

export default class WebPaasProjectAdditionalOptionCtrl {
  getPrice() {
    const { price } = get(this.option, 'prices').find(({ capacities }) =>
      capacities.includes('renew'),
    );
    if (this.option.planCode === 'storage') {
      const stagingEnvAddon = this.plan.addons.find(
        (addon) => addon.family === 'staging_environment',
      );
      return `${(2 + stagingEnvAddon.quantity) *
        price.value *
        (this.option.quantity / 5)} ${price.text.split('').pop()}`;
    }
    return `${price.value * (this.option.quantity || 0)} ${price.text
      .split('')
      .pop()}`;
  }
}
