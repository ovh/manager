export default class {
  onAddPrivateNetworkClick() {
    this.trackClick('PCI_PROJECTS_NETWORK_ADD');
    return this.createNetwork();
  }
}
