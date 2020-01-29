import sortBy from 'lodash/sortBy';

import { CONNECTION_CONSTANT, PLAN_CONSTANT } from './constants';

export default class {
  /* @ngInject */
  constructor() {
    this.CONNECTION_CONSTANT = CONNECTION_CONSTANT;
    this.PLAN_CONSTANT = PLAN_CONSTANT;
  }

  $onInit() {
    this.detailedPlans = sortBy(this.plans, 'registryLimits.imageStorage');
    [this.selectedPlan] = this.detailedPlans;
    this.onSelected(this.selectedPlan);
  }

  onSelected(model) {
    if (this.onChange) {
      this.onChange({ modelValue: model });
    }
  }
}
