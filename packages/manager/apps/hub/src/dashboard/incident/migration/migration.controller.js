export default class IncidentMigrationController {
  /* @ngInject */
  constructor(atInternet, coreURLBuilder) {
    this.atInternet = atInternet;
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
    this.isAllMigrated =
      this.servicesToMigrate.length && !this.impactedServices.length;

    this.followUpUrl =
      this.servicesToMigrate.length === 1
        ? this.coreURLBuilder.buildURL(
            'dedicated',
            `#/billing/orders/${this.servicesToMigrate[0].orderId}`,
          )
        : this.coreURLBuilder.buildURL('dedicated', '#/billing/orders');

    this.selectAllServices = false;
    this.servicesToMigrate = {};
    this.isServiceSelected = false;
  }

  selectAll(modelValue) {
    this.selectAllServices = modelValue;
    this.isServiceSelected = modelValue;
    this.servicesToMigrate = this.impactedServices.reduce(
      (acc, { serviceToMigrate }) => ({
        ...acc,
        [serviceToMigrate.serviceId]: modelValue,
      }),
      {},
    );
  }

  select(modelValue, serviceId) {
    this.servicesToMigrate[serviceId] = modelValue;
    const selectedServices = Object.values(this.servicesToMigrate);
    this.isServiceSelected = selectedServices.some((value) => !!value);
    this.selectAllServices =
      selectedServices.filter((value) => !!value).length ===
      this.impactedServices.length;
  }

  migrateService(service) {
    this.trackClick('go-to-service-replacement');
    return this.confirmMigration([service.serviceToMigrate.serviceId]);
  }

  migrate() {
    // As we store in an object, input that is a long originally is converted to a string
    // We convert it back before using it elsewhere to respect expected type
    const services = Object.keys(this.servicesToMigrate)
      .filter((service) => !!this.servicesToMigrate[service])
      .map((serviceId) => parseInt(serviceId, 10));
    this.trackClick(`go-to-bulk-replacement::${services.length}`);
    return this.confirmMigration(services);
  }

  static getDatacenterRegion(datacenter) {
    return datacenter.replace(/[0-9]+/, '');
  }

  trackClick(tracker) {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::${tracker}`,
      type: 'action',
    });
  }
}
