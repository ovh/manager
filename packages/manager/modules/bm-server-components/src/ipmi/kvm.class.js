export default class DedicatedServerKvm {
  constructor({ expiration, ip, name }, canOrderKvm) {
    Object.assign(this, {
      expiration,
      ip,
      name,
      orderKvmEnabled: canOrderKvm,
    });
  }

  canOrderKvm() {
    return this.orderKvmEnabled;
  }

  featuresAvailable() {
    return this.name || this.expiration;
  }
}
