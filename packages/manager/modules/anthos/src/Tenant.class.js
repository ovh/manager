export default class Tenant {
  /**
   * Create a Anthos tenant instance
   * @param tenant {Object}: native JS object
   * @param ovhSubsidiary {String|undefined}: (optional) used to get link info
   * */
  constructor(tenant, ovhSubsidiary) {
    Object.assign(this, tenant);

    this.ovhSubsidiary = ovhSubsidiary;
  }
}
