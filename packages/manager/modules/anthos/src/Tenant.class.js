export default class Tenant {
  /**
   * Create a Anthos tenant instance
   * @param tenant {Object}: native JS object
   * @param ovhSubsidiary {String|undefined}: (optional) used to get link info
   * */
  constructor(tenant, ovhSubsidiary) {
    this.update(tenant);

    this.ovhSubsidiary = ovhSubsidiary;
  }

  set storageAccessUrl(url) {
    this.storage.accessUrl = url;
  }

  update(tenant) {
    Object.assign(this, tenant);
  }
}
