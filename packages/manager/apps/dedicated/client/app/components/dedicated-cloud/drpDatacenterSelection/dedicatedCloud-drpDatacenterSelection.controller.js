export default class {
  selectDatacenter(datacenterId) {
    this.isRedirecting = true;
    return this.goToDrp(datacenterId);
  }
}
