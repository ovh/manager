export default class {
  selectDatacenter(datacenterId) {
    this.isRedirecting = true;
    return this.goToDrpConfiguration(datacenterId);
  }
}
