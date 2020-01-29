import find from 'lodash/find';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import RegistryPlan from './RegistryPlan.class';

export default class {
  /* @ngInject */
  constructor(
    CucCloudMessage,
    OvhApiOrderCatalogPublic,
    OvhApiCloudProjectContainerRegistryPlan,
  ) {
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiOrderCatalogPublic = OvhApiOrderCatalogPublic;
    this.OvhApiCloudProjectContainerRegistryPlan = OvhApiCloudProjectContainerRegistryPlan;
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
      })
      .finally(() => {
        this.loading = false;
      });
  }

  upgradeOffer() {
    this.loading = true;
    return this.OvhApiCloudProjectContainerRegistryPlan.v6()
      .update(
        {
          serviceName: this.projectId,
          registryID: this.registryId,
        },
        {
          planID: this.selectedPlan.id,
        },
      )
      .$promise.then(() => this.onSuccess())
      .catch((error) => this.onError({ error }))
      .finally(() => {
        this.loading = false;
      });
  }
}
