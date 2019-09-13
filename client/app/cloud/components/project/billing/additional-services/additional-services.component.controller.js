export default class AdditionalServicesComponentCtrl {
  /* @ngInject */
  constructor($stateParams, $translate, CucControllerHelper,
    OvhApiMe, CucServiceHelper, OvhApiCloudProjectInstance) {
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.CucControllerHelper = CucControllerHelper;
    this.OvhApiMe = OvhApiMe;
    this.CucServiceHelper = CucServiceHelper;
    this.OvhApiCloudProjectInstance = OvhApiCloudProjectInstance;
  }

  $onInit() {
    this.initAccordions();
    if (this.getPlatformCount() > 0) {
      this.initInstances();
    }
  }

  /**
   * initiate UI accordion state, one accordian per platform
   */
  initAccordions() {
    const accordions = _.mapValues(this.services, () => false);
    this.toggle = {
      accordions,
    };
  }

  /**
   * get all instances for this PCI project
   */
  initInstances() {
    // instances details are required to get instances name
    this.instances = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.OvhApiCloudProjectInstance.v6()
        .query({
          serviceName: this.$stateParams.projectId,
        })
        .$promise.then((instances) => {
          _.forEach(_.keys(this.services), (key) => {
            _.map(this.services[key], (service) => {
              const instance = _.find(instances, { id: service.instanceId });
              if (instance) {
                _.set(service, 'name', instance.name || service.instanceId);
              } else {
                // instance deleted, name not available, show the id
                _.set(service, 'name', service.instanceId);
              }
            });
          });
        }),
    });
    return this.instances.load();
  }

  /**
   * returns number of platforms (like bigdat platform) deployed on this PCI
   */
  getPlatformCount() {
    return _.size(this.services);
  }

  /**
   * calculate total price of all instances for a given platform
   * @param {string} platform name
   */
  getTotalPriceByPlatform(platform) {
    const instances = _.get(this.services, platform);
    const totalPriceByPlatform = _.reduce(
      instances,
      (sum, instance) => (sum + instance.totalPrice),
      0,
    );
    return totalPriceByPlatform.toFixed(2);
  }

  /**
   * get formated price of a given instance
   * @param {object} service
   */
  getAditionalServicePrice(service) {
    const totalPrice = _.get(service, 'totalPrice', 0);
    return `${totalPrice} ${this.currencySymbol}`;
  }
}

angular.module('managerApp').controller('AdditionalServicesComponentCtrl', AdditionalServicesComponentCtrl);
