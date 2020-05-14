export default class Service {
  constructor({ serviceId, route, resource }) {
    Object.assign(this, {
      serviceId,
      route,
      resource,
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
}
