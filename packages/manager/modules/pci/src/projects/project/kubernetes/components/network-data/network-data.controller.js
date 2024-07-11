export default class PCIKubernetesNetworkDataController {
  get public() {
    return !this.network || !this.network.privateNetworkRoutingAsDefault;
  }

  get private() {
    return this.network?.privateNetworkRoutingAsDefault;
  }

  get ip() {
    return this.network?.defaultVrackGateway || '';
  }
}
