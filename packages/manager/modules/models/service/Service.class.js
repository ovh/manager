export default class Service {
  constructor({ billing, serviceId, route, resource }) {
    Object.assign(this, {
      serviceId,
      route,
      resource,
      billing,
    });

    this.route.url = route.url.replace(
      this.resource.name,
      window.encodeURIComponent(this.resource.name),
    );
  }

  get name() {
    return this.resource.displayName || this.resource.name;
  }

  get path() {
    return this.route.url;
  }

  get nextBillingDate() {
    return moment(this.billing.nextBillingDate).format('LL');
  }

  get productType() {
    return this.route.path
      .replace(/{.*}/, '')
      .split('/')
      .filter((item) => !!item)
      .join('_');
  }
}
