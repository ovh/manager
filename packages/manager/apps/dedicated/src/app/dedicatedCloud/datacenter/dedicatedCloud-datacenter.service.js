import _ from 'lodash';

angular
  .module('App')
  .service('ovhManagerPccDatacenterService', class OvhManagerPccDatacenterService {
    constructor(
      OvhApiMe,
    ) {
      this.OvhApiMe = OvhApiMe;
    }

    fetchConsumptionForAllServices() {
      return this.OvhApiMe.v6().consumption().$promise;
    }

    fetchConsumptionForService(serviceId) {
      return this
        .fetchConsumptionForAllServices()
        .then(OvhManagerPccDatacenterService.keepOnlyConsumptionForService(serviceId));
    }

    static extractElementConsumption({ elements }, { id, type }) {
      return _.find(
        OvhManagerPccDatacenterService.keepOnlyElementDetailsWithType(elements, type),
        OvhManagerPccDatacenterService.keepOnlyElement(id),
      );
    }

    static keepOnlyElementDetailsWithType(elements, type) {
      return _.flatten(
        _.map(
          OvhManagerPccDatacenterService.keepOnlyElementsWithType(elements, type),
          'details',
        ),
      );
    }

    static keepOnlyConsumptionForService(serviceId) {
      return consumptionForAllServices => _.find(consumptionForAllServices, { serviceId });
    }

    static keepOnlyElementsWithType(elements, { planFamily }) {
      return _.filter(elements, { planFamily });
    }

    static keepOnlyElement(id) {
      return element => element.uniqueId.split('@')[0] === `${id}`;
    }
  });
