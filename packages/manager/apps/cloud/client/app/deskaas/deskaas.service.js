class DeskaasService {
  constructor(
    OvhApiDeskaasService,
    OvhApiMe,
    deskaasSidebar,
    DESKAAS_REFERENCES,
  ) {
    this.OvhApiDeskaasService = OvhApiDeskaasService;
    this.OvhApiMe = OvhApiMe;
    this.deskaasSidebar = deskaasSidebar;
    this.DESKAAS_REFERENCES = DESKAAS_REFERENCES;
    this.OrderPlanOffers = [];
  }

  getMe() {
    return this.OvhApiMe.v6().get().$promise;
  }

  fetchProductPlans(me) {
    // Use the catalog to get Product for deskaas
    const promise = this.OvhApiDeskaasService.v6().getProducts({
      ovhSubsidiary: me.ovhSubsidiary,
    }).$promise;
    promise.then((catalog) => {
      const newOrderPlanOffers = {};
      catalog.plans.forEach((catalogEntry) => {
        newOrderPlanOffers[catalogEntry.planCode] = {
          planCode: catalogEntry.planCode,
          priceInUcents: catalogEntry.details.pricings.default[0].priceInUcents,
          productName: catalogEntry.invoiceName,
          priceText: catalogEntry.details.pricings.default[0].price.text,
        };
      });
      this.OrderPlanOffers = newOrderPlanOffers;
    });
    return promise;
  }

  getUpgradeOptions(planCode) {
    const ref = [];
    const curRef = this.DESKAAS_REFERENCES[planCode];
    if (curRef) {
      curRef.upgrades.forEach((upgrade) => {
        if (this.DESKAAS_REFERENCES[upgrade] && this.OrderPlanOffers[upgrade]) {
          this.DESKAAS_REFERENCES[upgrade].priceText = this.OrderPlanOffers[
            upgrade
          ].priceText;
          ref.push(this.DESKAAS_REFERENCES[upgrade]);
        }
      });
    }
    // else {
    //   console.log(`Error: PlanCode ${planCode} not known`);
    // }
    return ref;
  }

  getDetails(serviceName) {
    return this.OvhApiDeskaasService.v6()
      .getDetails({ serviceName })
      .$promise.then((response) => {
        this.deskaasSidebar.updateItem(response);
        return response;
      });
  }
}

angular.module('managerApp').service('DeskaasService', DeskaasService);
