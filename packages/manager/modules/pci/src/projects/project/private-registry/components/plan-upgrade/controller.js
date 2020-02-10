import find from 'lodash/find';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import RegistryPlan from './RegistryPlan.class';

export default class {
  /* @ngInject */
  constructor(CucCloudMessage, OvhApiOrderCatalogPublic) {
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiOrderCatalogPublic = OvhApiOrderCatalogPublic;
  }

  $onInit() {
    this.loading = true;
    return this.OvhApiOrderCatalogPublic.v6()
      .get({
        productName: 'cloud',
        ovhSubsidiary: this.user.ovhSubsidiary,
      })
      .$promise.then(({ addons }) => {
        this.detailedPlans = sortBy(
          map(
            this.plans,
            (plan) =>
              new RegistryPlan({
                ...plan,
                ...find(addons, { planCode: plan.planCode }),
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
