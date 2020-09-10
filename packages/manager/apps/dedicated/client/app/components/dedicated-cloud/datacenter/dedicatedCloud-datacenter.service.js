import filter from 'lodash/filter';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import map from 'lodash/map';

export default class OvhManagerPccDatacenterService {
  /* @ngInject */
  constructor(OvhApiMe) {
    this.OvhApiMe = OvhApiMe;
  }

  fetchConsumptionForAllServices() {
    return this.OvhApiMe.v6().consumption().$promise;
  }

  fetchConsumptionForService(serviceId) {
    return this.fetchConsumptionForAllServices().then(
      OvhManagerPccDatacenterService.keepOnlyConsumptionForService(serviceId),
    );
  }

  static extractElementConsumption({ elements }, { id, type }) {
    return find(
      OvhManagerPccDatacenterService.keepOnlyElementDetailsWithType(
        elements,
        type,
      ),
      OvhManagerPccDatacenterService.keepOnlyElement(id),
    );
  }

  static keepOnlyElementDetailsWithType(elements, type) {
    return flatten(
      map(
        OvhManagerPccDatacenterService.keepOnlyElementsWithType(elements, type),
        'details',
      ),
    );
  }

  static keepOnlyConsumptionForService(serviceId) {
    return (consumptionForAllServices) =>
      find(consumptionForAllServices, { serviceId });
  }

  static keepOnlyElementsWithType(elements, { planFamily }) {
    return filter(elements, { planFamily });
  }

  static keepOnlyElement(id) {
    return (element) => element.uniqueId.split('@')[0] === `${id}`;
  }
}
