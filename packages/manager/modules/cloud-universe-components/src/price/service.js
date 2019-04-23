import find from 'lodash/find';
import forEach from 'lodash/forEach';

export default class OvhCloudPriceHelper {
  /* @ngInject */
  constructor(
    $q,
    OvhApiCloudProject,
    OvhApiMe,
    OvhApiOrderCatalogFormatted,
  ) {
    this.$q = $q;
    this.OvhApiOrderCatalogFormatted = OvhApiOrderCatalogFormatted;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.OvhApiMe = OvhApiMe;
  }

  getPrices(serviceName) {
    return this.$q.all({
      catalog: this.OvhApiMe.v6().get().$promise
        .then(me => this.OvhApiOrderCatalogFormatted
          .v6()
          .get({ catalogName: 'cloud', ovhSubsidiary: me.ovhSubsidiary })
          .$promise),
      project: this.OvhApiCloudProject.v6().get({ serviceName }).$promise,
    })
      .then(({ catalog, project }) => {
        const projectPlan = find(catalog.plans, { planCode: project.planCode });
        if (!projectPlan) {
          throw new Error({ message: 'Fail to get project plan' });
        }

        const pricesMap = {};
        forEach(projectPlan.addonsFamily, (family) => {
          forEach(family.addons, (price) => {
            pricesMap[price.plan.planCode] = price.plan.details.pricings.default.length
              ? price.plan.details.pricings.default[0]
              : undefined;
          });
        });
        return pricesMap;
      });
  }
}
