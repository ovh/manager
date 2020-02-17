import sortBy from 'lodash/sortBy';
import map from 'lodash/map';
import find from 'lodash/find';
import RegistryPlan from './RegistryPlan.class';

import {
  CONNECTION_CONSTANT,
  HOURLYTOMONTHLY,
  PLAN_CONSTANT,
} from './constants';

export default class {
  /* @ngInject */
  constructor(OvhApiOrderCatalogPublic) {
    this.OvhApiOrderCatalogPublic = OvhApiOrderCatalogPublic;
    this.CONNECTION_CONSTANT = CONNECTION_CONSTANT;
    this.HOURLYTOMONTHLY = HOURLYTOMONTHLY;
    this.PLAN_CONSTANT = PLAN_CONSTANT;
  }

  $onInit() {
    this.loading = true;
    return this.OvhApiOrderCatalogPublic.v6()
      .get({
        productName: 'cloudPreprod',
        ovhSubsidiary: this.user.ovhSubsidiary,
      })
      .$promise.then(({ addons }) => {
        this.detailedPlans = sortBy(
          map(
            this.plans,
            (plan) =>
              new RegistryPlan({
                ...plan,
                ...find(addons, { planCode: this.HOURLYTOMONTHLY[plan.code] }),
              }),
          ),
          'registryLimits.imageStorage',
        );
        [this.selectedPlan] = this.detailedPlans;
        this.onSelected(this.selectedPlan);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  onSelected(model) {
    if (this.onChange) {
      this.onChange({ modelValue: model });
    }
  }
}
