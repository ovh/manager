import get from 'lodash/get';

export default class PlanFamily {
  constructor({ name, plans, selectedPlan }) {
    Object.assign(this, {
      name,
      plans,
      selectedPlan,
    });
  }

  getLowestPrice() {
    return get(this.plans[0], 'pricings').find(({ capacities }) =>
      capacities.includes('renew'),
    ).price;
  }
}
