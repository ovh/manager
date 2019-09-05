export default class {
  $onInit() {
    this.expand = {};

    this.availableServices = this.services.available;
    this.unavailableServices = _.omit(this.services, 'available');

    this.servicesCount = _.flatten(_.values(this.services)).length;

    this.unavailableServicesCount = _.reduce(
      this.unavailableServices,
      (count, services) => count + services.length,
      0,
    );
  }
}
