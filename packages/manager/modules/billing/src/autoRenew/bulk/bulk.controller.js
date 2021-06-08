import flatten from 'lodash/flatten';
import omit from 'lodash/omit';
import reduce from 'lodash/reduce';
import values from 'lodash/values';

export default class {
  $onInit() {
    this.expand = {};

    this.availableServices = this.services.available;
    this.unavailableServices = omit(this.services, 'available');

    this.servicesCount = flatten(values(this.services)).length;

    this.unavailableServicesCount = reduce(
      this.unavailableServices,
      (count, services) => count + services.length,
      0,
    );
  }
}
